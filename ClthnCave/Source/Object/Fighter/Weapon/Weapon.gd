class_name FighterWeapon
extends Node2D

signal main_attack_used();
signal other_attack_used();

enum attack {
	left = -1,
	right = 1,
}

@export var main_body_offset: float = 10.0;

var user: Fighter;
var pivot: Node2D;

var body_offset: float;

var aim_direction: = Vector2.RIGHT;
var rotation_offset: float;

var face_direction: float = 1;

var attacks_data: Dictionary;

@onready var animation_body: Node2D = $AnimationBody;
@onready var animation_main_sprite: Sprite2D = $AnimationBody/Main;
@onready var animation_player: AnimationPlayer = $AnimationPlayer;


func _ready() -> void:
	for index in attack.values():
		attacks_data[index] = {
			"is_useable": false,
			"can_attack": false,
			"is_attacking": false,
			"attack_cooldown": 0.0,
		}

func _physics_process(delta: float) -> void:
	for index in attacks_data.keys():
		attacks_data[index]["attack_cooldown"] = move_toward(attacks_data[index]["attack_cooldown"], 0.0, delta);
	
	animation_body.position = Vector2.RIGHT * (main_body_offset + body_offset);
	animation_body.scale.y = abs(animation_body.scale.y) * sign(face_direction);
	
	pivot.rotation = aim_direction.angle();
	rotation = rotation_offset;


func use_attack(type: attack) -> void:
	attacks_data[type]["is_attacking"] = true;
	match (type):
		attack.left:
			emit_signal("main_attack_used");
		attack.right:
			emit_signal("other_attack_used");


func setup(target_user: Fighter) -> void:
	if (is_instance_valid(target_user)):
		user = target_user;
		pivot = user.weapon_pivot;
