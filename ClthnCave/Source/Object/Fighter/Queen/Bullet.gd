extends Actor

var user: Fighter;

var movement_direction: Vector2;
var speed_percent: float = 1.75;


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
		queue_free();
	
	velocity = movement_direction * speed_percent * 192.0;
	
	move_and_slide();
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
	
	rotation = movement_direction.angle();


func _on_hitbox_attacked(hurtboxes: Array[Hurtbox]) -> void:
	queue_free();
