extends Fighter

var movement_direction: Vector2;

var damage_circle_alpha: float = 0.0;
var damage_circle_radius: float = 64.0;

@export var king_movement_speed: float = 128.0;
@export var rock_movement_speed: float = 80.0;


func _ready() -> void:
	$Hitbox/CollisionShape2D.disabled = true;
	
	animation_main_sprite.visible = true;
	$AnimationBody/Protection.visible = false;
	weapon_pivot.visible = true;
	
	movement_speed = king_movement_speed;
	
	super();
	
	await get_tree().physics_frame;
	
	set_hitbox_collision($Hitbox, self);

func _physics_process(delta: float) -> void:
	if (is_player == false):
		var enemy_direction: Vector2 = global_position.direction_to(enemy_fighter.global_position);
		var enemy_distance: float = global_position.distance_to(enemy_fighter.global_position);
		
		if ((can_use_main_attack == true) && ((health.current_health > 1) || (enemy_fighter.health.current_health <= 1))) || ((can_use_other_attack == true) || (is_protected())):
			if (enemy_distance > 64.0):
				movement_direction = enemy_direction;
			else:
				if (enemy_distance > 48.0):
					movement_direction = Vector2.ZERO;
				else:
					movement_direction = -enemy_direction;
				
				use_main_attack();
			
			if (can_use_other_attack == true):
				if (enemy_distance <= 62.0):
					use_other_attack();
		else:
			if (weapon.attacks_data[FighterWeapon.attack.left]["is_attacking"] == false):
				if (enemy_distance > 192.0):
					movement_direction = enemy_direction;
				elif (enemy_distance > 192.0 - 16.0):
					movement_direction = Vector2.ZERO;
				else:
					movement_direction = -enemy_direction;
					
					if (enemy_distance <= 64.0):
						
						use_main_attack();
			else:
				movement_direction = Vector2.ZERO;
		
		movement_direction = movement_direction.rotated(deg_to_rad(randf_range(-60.0, 60.0)));
		
		move_in_direction(movement_direction, movement_speed, 0.1, 0.1, false, delta);
		
		if (is_instance_valid(weapon)) && (is_instance_valid(enemy_fighter)):
			weapon.aim_direction = weapon_pivot.global_position.direction_to(enemy_fighter.global_position);
	
	super(delta);
	
	$AnimationBody/Protection.frame = 0 if (is_black == false) else 1;


func activate_protection() -> void:
	var tween: Tween = create_tween();
	tween.set_parallel();
	
	animation_main_sprite.visible = false;
	$AnimationBody/Protection.visible = true;
	weapon_pivot.visible = false;
	
	$Hitbox/CollisionShape2D.disabled = false;
	
	movement_speed = rock_movement_speed;
	
	damage_circle_alpha = 0.25;
	damage_circle_radius += 8.0;
	$AnimationBody/Protection.scale = Vector2.ONE * 1.5;
	tween.tween_property($AnimationBody/Protection, "scale", Vector2.ONE, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "damage_circle_radius", damage_circle_radius - 8.0, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "damage_circle_alpha", 1.0, 0.2);
	
	var time: float;
	while (true):
		await get_tree().physics_frame;
		
		$Circle.queue_redraw();
		
		time += get_physics_process_delta_time();
		if (time > 1.0):
			break;

func deactivate_protection() -> void:
	var tween: Tween = create_tween();
	tween.set_parallel();
	
	animation_main_sprite.visible = true;
	$AnimationBody/Protection.visible = false;
	weapon_pivot.visible = true;
	
	$Hitbox/CollisionShape2D.disabled = true;
	
	movement_speed = king_movement_speed;
	
	animation_main_sprite.scale = Vector2.ONE * 1.5;
	tween.tween_property(animation_main_sprite, "scale", Vector2.ONE, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "damage_circle_alpha", 0.0, 0.5).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT);
	
	var time: float;
	while (true):
		await get_tree().physics_frame;
		
		$Circle.queue_redraw();
		
		time += get_physics_process_delta_time();
		if (time > 1.0):
			break;

func is_protected() -> bool:
	return $AnimationBody/Protection.visible;


func _on_hurtbox_update_hurtbox_data(_hitbox: Hitbox) -> void:
	if (is_protected()):
		hurtbox.can_be_attacked = false;
	elif (is_player == false) && (can_use_other_attack == true):
		use_other_attack();
		
		hurtbox.can_be_attacked = false;
