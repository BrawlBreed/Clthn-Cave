class_name Actor
extends CharacterBody2D

const state_free: String = "free";
const state_moving: String = "moving";
const state_wall_climbing: String = "wall_climbing";
const state_celling_climbing: String = "celling_climbing";
const state_dead: String = "dead";

@export_range(-1, 1, 2) var face_direction: int = 1;

var state: StateMachine;

@onready var animation_body: Node2D = $AnimationBody;
@onready var animation_main_sprite: Sprite2D = $AnimationBody/Main;
@onready var animation_player: AnimationPlayer = $AnimationPlayer;


func _ready() -> void:
	randomize();
	
	state = StateMachine.setup(get("start_state") if (get("start_state") is String) else "", self);


func move_in_direction(direction: Vector2, movement_speed: float, movement_acceleration: float, movement_deceleration: float, can_move_faster: bool = false, delta: float = get_physics_process_delta_time()) -> bool:
	var is_moving: bool;
	
	is_moving = (direction != Vector2.ZERO) || (velocity != Vector2.ZERO);
	
	if (direction.x != 0.0) && (velocity.x * direction.x >= 0.0):
		# movement_acceleration is the time needed to reach full speed, used to make movement smoother.
		velocity.x = move_toward(velocity.x, direction.x * movement_speed, movement_speed * (delta / movement_acceleration));
	else:
		# movement_deceleration is the time needed to stop moving, used to make movement smoother.
		velocity.x = move_toward(velocity.x, direction.x * movement_speed, movement_speed * (delta / movement_deceleration));
	
	if (direction.y != 0.0) && (velocity.x * direction.x >= 0.0):
		# movement_acceleration is the time needed to reach full speed, used to make movement smoother.
		velocity.y = move_toward(velocity.y, direction.y * movement_speed, movement_speed * (delta / movement_acceleration));
	else:
		# movement_deceleration is the time needed to stop moving, used to make movement smoother.
		velocity.y = move_toward(velocity.y, direction.y * movement_speed, movement_speed * (delta / movement_deceleration));
	
	return is_moving; # Return if moving or not.


func add_gravity(delta: float = get_physics_process_delta_time(), force: float = Global.gravity_force) -> void:
	velocity.y = move_toward(velocity.y, force, force * delta);


func update_face_direction(direction: int = face_direction) -> void:
	animation_body.scale.x = absf(animation_main_sprite.scale.x) * signf(direction);
