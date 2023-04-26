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
	for collision_index in get_slide_collision_count():
		queue_free();
	
	velocity = movement_direction * speed_percent * 192.0;
	
	move_and_slide();
	
	rotation = movement_direction.angle();


func _on_hitbox_attacked(hurtboxes: Array[Hurtbox]) -> void:
	queue_free();
