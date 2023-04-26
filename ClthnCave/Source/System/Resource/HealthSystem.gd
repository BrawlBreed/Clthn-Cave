class_name HealthSystem;
extends Node;

signal max_health_changed();
signal health_changed();
signal damaged(custom_data: Dictionary);
signal died(custom_data: Dictionary);

var max_health: int;
var current_health: int;


func set_max_health(value: int) -> void:
	if (value != max_health):
		max_health = value;
		current_health = mini(current_health, max_health);
		
		emit_signal("max_health_changed");

func set_health(value: int) -> void:
	value = clampi(0, value, max_health)
	if (clampi(0, value, max_health) != current_health):
		current_health = value;
		
		emit_signal("health_changed");


func take_damage(value: int, custom_data: Dictionary = {}) -> int:
	var final_value: int = value;
	
	if (current_health > 0):
		if (final_value > 0):
			set_health(current_health - final_value);
			
			if (current_health > 0):
				emit_signal("damaged", custom_data);
			else:
				emit_signal("died", custom_data);
		else:
			final_value = 0;
	
	return final_value;

func heal(value: int, custom_data: Dictionary = {}) -> int:
	var final_value: int = value;
	
	if (current_health > 0):
		if (final_value > 0):
			set_health(current_health + final_value);
		else:
			final_value = 0;
	
	return final_value;


static func setup(start_health: int, user: Node = null, system_name: String = "HealthSystem") -> HealthSystem:
	var health_system: = HealthSystem.new();
	
	if (is_instance_valid(user)):
		user.add_child(health_system);
		health_system.name = system_name;
	
	health_system.set_max_health(start_health);
	health_system.set_health(start_health);
	
	return health_system;
