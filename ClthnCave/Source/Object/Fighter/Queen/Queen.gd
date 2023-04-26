extends Fighter

const dagger_movement_speed: float = 128.0;
const bow_movement_speed: float = 128.0 - 32.0;

var movement_direction: Vector2;


func _physics_process(delta: float) -> void:
	movement_speed = dagger_movement_speed if (weapon.is_bow == false) else bow_movement_speed;
	
	if (is_player == false):
		var enemy_direction: Vector2 = global_position.direction_to(enemy_fighter.global_position);
		var enemy_distance: float = global_position.distance_to(enemy_fighter.global_position);
		
		if (can_use_other_attack == true):
			if (weapon.is_bow == false):
				if (health.current_health <= health.max_health * 0.5) || (enemy_fighter.health.current_health <= min(enemy_fighter.health.max_health * 2, 3)):
					use_other_attack();
			else:
				if (health.current_health > health.max_health * 0.5) && (enemy_fighter.health.current_health > min(enemy_fighter.health.max_health * 2, 3)):
					use_other_attack();
		
		if (weapon.is_bow == false):
			if (can_use_main_attack == true):
				if (enemy_distance > 32.0):
					movement_direction = enemy_direction;
				else:
					if (enemy_distance > 16.0):
						movement_direction = Vector2.ZERO;
					else:
						movement_direction = -enemy_direction;
					
					use_main_attack();
			else:
				if (weapon.attacks_data[FighterWeapon.attack.left]["is_attacking"] == false):
					if (enemy_distance > 192.0):
						movement_direction = enemy_direction;
					elif (enemy_distance > 192.0 - 16.0):
						movement_direction = Vector2.ZERO;
					else:
						movement_direction = -enemy_direction;
				else:
					movement_direction = Vector2.ZERO;
		else:
			if (enemy_distance > 256.0):
				movement_direction = enemy_direction;
			else:
				if (enemy_distance > 256.0 - 32.0):
					movement_direction = Vector2.ZERO;
				else:
					movement_direction = -enemy_direction;
				
				use_main_attack();
		
		move_in_direction(movement_direction, movement_speed, 0.1, 0.1, false, delta);
		
		if (is_instance_valid(weapon)) && (is_instance_valid(enemy_fighter)):
			if (weapon.is_bow == false):
				weapon.aim_direction = weapon_pivot.global_position.direction_to(enemy_fighter.global_position);
			else:
				weapon.aim_direction = Vector2.RIGHT.rotated(lerp_angle(weapon.aim_direction.angle(), weapon_pivot.global_position.direction_to(enemy_fighter.global_position).angle(), 8.0 * delta));
	
	super(delta);
