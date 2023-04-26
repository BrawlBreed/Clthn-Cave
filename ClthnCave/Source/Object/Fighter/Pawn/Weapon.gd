extends FighterWeapon

var sword_rotation_direction: int = 1;


func _ready() -> void:
	super();
	
	rotation_offset = sword_rotation_direction * PI / 2;
	face_direction = sword_rotation_direction;
	
	$AnimationBody/Hitbox/CollisionShape2D.disabled = true;
	
	await get_tree().physics_frame;
	
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);

func _physics_process(delta: float) -> void:
	attacks_data[attack.left]["is_useable"] = true;
	attacks_data[attack.left]["can_attack"] = (is_visible_in_tree());
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
	
	super(delta);


func on_main_attack_used() -> void:
	var tween: Tween = create_tween();
	
	sword_rotation_direction *= -1;
	
	$AnimationBody/Hitbox.clear_hitted_hurtboxes();
	$AnimationBody/Hitbox/CollisionShape2D.disabled = false;
	
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(105), 0.2).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "face_direction", face_direction * -1, 0.0);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", true, 0.0);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(90), 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN);
	attacks_data[attack.left]["attack_cooldown"] = 0.1 + 0.3;
	
	await tween.finished;
	
	attacks_data[attack.left]["is_attacking"] = false;
