class_name Hurtbox
extends Area2D

signal update_hurtbox_data(hitbox: Hitbox);
signal hurted(hitbox: Hitbox);

@export var is_attackable: bool = true;

var can_be_attacked: bool = true;
var attack_cooldown: float;

var health: HealthSystem;


func _ready() -> void:
	collision_mask = 0;
	
	add_to_group("hurtbox");

func _physics_process(delta: float) -> void:
	attack_cooldown = move_toward(attack_cooldown, 0.0, delta);
	if (attack_cooldown <= 0.0):
		set_physics_process(false);


func hitbox_attacked(hitbox: Hitbox) -> void:
	if (is_attackable == true) && (attack_cooldown <= 0.0) && (is_instance_valid(hitbox)):
		can_be_attacked = true;
		emit_signal("update_hurtbox_data", hitbox);
		if (can_be_attacked == true):
			var custom_data: Dictionary = hitbox.attack_custom_data;
			custom_data["hitbox"] = hitbox;
			
			if (is_instance_valid(health)):
				health.take_damage(hitbox.attack_damage, custom_data);
			
			emit_signal("hurted", hitbox);


func set_attack_cooldown(cooldown: float) -> void:
	if (cooldown > 0.0):
		set_physics_process(true);
	attack_cooldown = cooldown;
