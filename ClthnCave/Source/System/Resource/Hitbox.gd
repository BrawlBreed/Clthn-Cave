class_name Hitbox
extends Area2D

signal update_hitbox_data(hurtbox: Hurtbox);
signal attacked(hurtboxes: Array[Hurtbox]);

@export var can_attack: bool = true;
@export var attack_damage: int = 1;
@export var attack_custom_data: Dictionary;
@export var max_targets: int; # this only works if the value is > 0.
@export var clear_time: float = -1.0; # this only works if the value is >= 0. 0 = auto clear.

@export var user: Node;

var hitted_hurtboxes: Array[Hurtbox];
var hitted_times: Array[float];


func _ready() -> void:
	collision_layer = 0;
	
	add_to_group("hitbox");

func _physics_process(delta: float) -> void:
	if (clear_time > 0.0):
		var new_hitted_hurtboxes: Array[Hurtbox];
		var new_hitted_times: Array[float];
		for index in hitted_times.size():
			hitted_times[index] = move_toward(hitted_times[index], 0.0, delta);
			if (is_instance_valid(hitted_hurtboxes[index])) && (hitted_times[index] > 0.0):
				new_hitted_hurtboxes.push_back(hitted_hurtboxes[index]);
				new_hitted_times.push_back(hitted_times[index]);
		
		hitted_hurtboxes = new_hitted_hurtboxes;
		hitted_times = new_hitted_times;
	
	if (can_attack == true):
		if (clear_time == 0.0):
			clear_hitted_hurtboxes();
		
		if (monitoring == true):
			var current_hitted_hurtboxes: Array[Hurtbox];
			for hurtbox in get_overlapping_areas():
				if (max_targets > 0) && (current_hitted_hurtboxes.size() >= max_targets):
					break;
				
				if (hurtbox is Hurtbox) && (!hurtbox in hitted_hurtboxes):
					emit_signal("update_hitbox_data", hurtbox);
					
					hurtbox.hitbox_attacked(self);
					
					hitted_hurtboxes.push_back(hurtbox);
					current_hitted_hurtboxes.push_back(hurtbox);
					if (clear_time > 0.0):
						hitted_times.push_back(clear_time);
			
			if (!current_hitted_hurtboxes.is_empty()):
				emit_signal("attacked", current_hitted_hurtboxes);

func clear_hitted_hurtboxes() -> void:
	hitted_hurtboxes.clear();
	hitted_times.clear();
