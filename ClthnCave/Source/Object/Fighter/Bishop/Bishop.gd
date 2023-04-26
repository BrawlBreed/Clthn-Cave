extends Fighter


var movement_direction: Vector2;


func _physics_process(delta: float) -> void:
	if (is_player == false):
		var enemy_direction: Vector2 = global_position.direction_to(enemy_fighter.global_position);
		var enemy_distance: float = global_position.distance_to(enemy_fighter.global_position);
		
		if (enemy_distance > 256.0):
			movement_direction = enemy_direction;
		else:
			if (enemy_distance > 256.0 - 32.0):
				movement_direction = Vector2.ZERO;
			else:
				movement_direction = -enemy_direction;
			
			use_main_attack();
		
		movement_direction = movement_direction.rotated(deg_to_rad(randf_range(-60.0, 60.0)));
		
		move_in_direction(movement_direction, movement_speed, 0.1, 0.1, false, delta);
		
		if (is_instance_valid(weapon)) && (is_instance_valid(enemy_fighter)):
			weapon.aim_direction = Vector2.RIGHT.rotated(lerp_angle(weapon.aim_direction.angle(), weapon_pivot.global_position.direction_to(enemy_fighter.global_position).angle(), 8.0 * delta));
	
	super(delta);
