extends Actor

var user: Fighter;

var movement_direction: Vector2;
var speed_percent: float = 2.25;

var remaining_distance: float = 128.0 * 6.0;


func _draw() -> void:
	draw_circle(Vector2.ZERO, 8.0, Color.BLACK);
	if (user.is_black == false):
		draw_circle(Vector2.ZERO, 7.0, Color.WHITE);
	else:
		draw_circle(Vector2.ZERO, 7.0, Color("#3a4466"));

func _ready() -> void:
	var tween: Tween = create_tween();
	tween.tween_property(self, "speed_percent", 1.0, 1.0).set_trans(Tween.TRANS_CUBIC);
	
	await get_tree().physics_frame;
	
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);

func _physics_process(delta: float) -> void:
	if (!is_instance_valid(user)):
		queue_free();
		return;
	
	for collision_index in get_slide_collision_count():
		var collision: KinematicCollision2D = get_slide_collision(collision_index);
		var normal: Vector2 = collision.get_normal();
		
		movement_direction = movement_direction.bounce(collision.get_normal());
		break;
	
	velocity = movement_direction * speed_percent * 128.0;
	
	move_and_slide();
	
	remaining_distance = move_toward(remaining_distance, 0.0, velocity.length() * delta);
	if (remaining_distance <= 0.0):
		queue_free();


func _on_hitbox_attacked(hurtboxes: Array[Hurtbox]) -> void:
	queue_free();
