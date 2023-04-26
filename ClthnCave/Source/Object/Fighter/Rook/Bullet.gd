extends Actor

var user: Fighter;

var movement_direction: Vector2;
var speed_percent: float = 2.25;


func _ready() -> void:
	$AnimationBody/Hitbox/CollisionShape2D.disabled = true;

func _physics_process(delta: float) -> void:
	if (!is_instance_valid(user)):
		queue_free();
		return;
	
	for collision_index in get_slide_collision_count():
		queue_free();
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
	
	velocity = movement_direction * speed_percent * 96.0;
	
	move_and_slide();
	
	rotate(PI * speed_percent * 0.75 * delta);


func fired() -> void:
	var tween: Tween = create_tween();
	tween.tween_property(self, "speed_percent", 1.0, 1.0).set_trans(Tween.TRANS_CUBIC);
	
	$AnimationBody/Hitbox/CollisionShape2D.disabled = false;
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);
