extends Fighter

const main_movement_speed: float = 192.0;
const slow_movement_speed: float = 192.0 - 64.0;

var movement_direction: Vector2;


func _physics_process(delta: float) -> void:
	movement_speed = main_movement_speed if (health.current_health > health.max_health * 0.5) else slow_movement_speed;
	
	if (is_player == false):
		var enemy_direction: Vector2 = global_position.direction_to(enemy_fighter.global_position);
		var enemy_distance: float = global_position.distance_to(enemy_fighter.global_position);
		
		if (can_use_main_attack == true) && ((health.current_health > 1) || (enemy_fighter.health.current_health <= 1)):
			if (enemy_distance > 64.0):
				movement_direction = enemy_direction;
			else:
				if (enemy_distance > 48.0):
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
					
					if (enemy_distance <= 64.0):
						
						use_main_attack();
			else:
				movement_direction = Vector2.ZERO;
		
		movement_direction = movement_direction.rotated(deg_to_rad(randf_range(-60.0, 60.0)));
		
		move_in_direction(movement_direction, movement_speed, 0.1, 0.1, false, delta);
		
		if (is_instance_valid(weapon)) && (is_instance_valid(enemy_fighter)):
			weapon.aim_direction = weapon_pivot.global_position.direction_to(enemy_fighter.global_position);
	
	super(delta);
