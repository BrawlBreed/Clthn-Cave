extends FighterWeapon

const bullet_scene: PackedScene = preload("res://Source/Object/Fighter/Rook/Bullet.tscn");

var sword_rotation_direction: int = 1;


func _ready() -> void:
	super();
	
	rotation_offset = sword_rotation_direction * PI / 2;
	face_direction = sword_rotation_direction;
	
	$AnimationBody/ShootingBody.modulate.a = 0.0;
	$AnimationBody/Hitbox/CollisionShape2D.disabled = true;
	
	await get_tree().physics_frame;
	
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);

func _physics_process(delta: float) -> void:
	attacks_data[attack.left]["is_useable"] = true;
	attacks_data[attack.left]["can_attack"] = (is_visible_in_tree());
	attacks_data[attack.right]["is_useable"] = true;
	attacks_data[attack.right]["can_attack"] = (is_visible_in_tree());
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
		$AnimationBody/ShootingBody.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
		$AnimationBody/ShootingBody.color = Color("#3a4466");
	
	super(delta);


func on_main_attack_used() -> void:
	var tween: Tween = create_tween();
	
	sword_rotation_direction *= -1;
	
	$AnimationBody/Hitbox.clear_hitted_hurtboxes();
	$AnimationBody/Hitbox/CollisionShape2D.disabled = false;
	
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(105), 0.2).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "face_direction", face_direction * -1, 0.0);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", true, 0.0);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(90), 0.3).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN);
	attacks_data[attack.left]["attack_cooldown"] = 0.35 + 0.5;
	
	await tween.finished;
	
	attacks_data[attack.left]["is_attacking"] = false;

func on_other_attack_used() -> void:
	var tween: Tween = create_tween();
	
	var bullet: Actor = bullet_scene.instantiate();
	$AnimationBody/BulletHolder.add_child(bullet);
	bullet.scale = Vector2.ZERO;
	bullet.user = user;
	
	sword_rotation_direction *= -1;
	
	tween.tween_property($AnimationBody/ShootingBody, "modulate:a", 1.0, 0.3);
	tween.tween_property(bullet, "scale", Vector2.ONE, 0.75);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(105), 0.3).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT);
	tween.tween_property(self, "face_direction", face_direction * -1, 0.0);
	tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", true, 0.0);
	tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(90), 0.3).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN);
	tween.tween_property($AnimationBody/ShootingBody, "modulate:a", 0.0, 0.1);
	attacks_data[attack.right]["attack_cooldown"] = 3.0 + 0.3 + 0.75 + 0.3 + 0.3;
	
	fire_bullet(bullet);
	
	await tween.finished;
	
	attacks_data[attack.right]["is_attacking"] = false;

func fire_bullet(bullet: Actor) -> void:
	await get_tree().create_timer(0.3 + 0.75 + 0.1).timeout;
	
	bullet.get_parent().remove_child(bullet);
	LevelData.current_level.get_node("%Bullets").add_child(bullet);
	bullet.global_position = $AnimationBody/BulletHolder.global_position;
	bullet.movement_direction = aim_direction;
	bullet.user = user;
	bullet.fired();
