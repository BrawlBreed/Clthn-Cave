extends FighterWeapon

const bullet_scene: PackedScene = preload("res://Source/Object/Fighter/Queen/Bullet.tscn");

var sword_rotation_direction: int = 1;

var is_bow: bool;

var rotation_speed_percent: float;


func _ready() -> void:
	super();
	
	rotation_offset = sword_rotation_direction * PI / 2;
	face_direction = sword_rotation_direction;
	$AnimationBody.rotation = rotation_offset;
	
	$AnimationBody/Hitbox/CollisionShape2D.disabled = true;
	$AnimationBody/Hitbox/CollisionShape2D2.disabled = true;
	
	await get_tree().physics_frame;
	
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);

func _physics_process(delta: float) -> void:
	attacks_data[attack.left]["is_useable"] = true;
	attacks_data[attack.left]["can_attack"] = (is_visible_in_tree());
	attacks_data[attack.right]["is_useable"] = true;
	attacks_data[attack.right]["can_attack"] = (is_visible_in_tree());
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
		$AnimationBody/Body/BladeBody.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
		$AnimationBody/Body/BladeBody.color = Color("#3a4466");
	
	$AnimationBody.rotation = rotation_offset;
	
	super(delta);
	
	$AnimationBody/Body/BladeBody.rotate(rotation_speed_percent * PI * face_direction * delta);


func on_main_attack_used() -> void:
	var tween: Tween = create_tween();
	
	sword_rotation_direction *= -1;
	
	$AnimationBody/Hitbox.clear_hitted_hurtboxes();
	$AnimationBody/Hitbox/CollisionShape2D2.disabled = false;
	
	tween.tween_property(self, "rotation_speed_percent", 8.0, 0.1);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", false, 0.0).set_delay(0.2);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(105), 0.2).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "face_direction", face_direction * -1, 0.0);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", true, 0.0);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D2, "disabled", true, 0.0);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(90), 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN);
	tween.tween_property(self, "rotation_speed_percent", 0.0, 0.25);
	attacks_data[attack.left]["attack_cooldown"] = 0.25 + 0.85;
	
	await tween.finished;
	
	attacks_data[attack.left]["is_attacking"] = false;

func on_other_attack_used() -> void:
	if (!user.is_protected()):
		user.activate_protection();
		
		await get_tree().create_timer(1.0).timeout;
		
		attacks_data[attack.right]["is_attacking"] = false;
		
		await get_tree().create_timer(2.0).timeout;
		
		if (user.is_protected()):
			user.deactivate_protection();
			
			attacks_data[attack.right]["attack_cooldown"] = 7.5;
	else:
		user.deactivate_protection();
		attacks_data[attack.right]["is_attacking"] = false;
		attacks_data[attack.right]["attack_cooldown"] = 5.0;
