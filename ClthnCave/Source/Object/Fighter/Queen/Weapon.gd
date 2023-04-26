extends FighterWeapon

const bullet_scene: PackedScene = preload("res://Source/Object/Fighter/Queen/Bullet.tscn");

var sword_rotation_direction: int = 1;

var is_bow: bool;


func _ready() -> void:
	super();
	
	rotation_offset = sword_rotation_direction * PI / 2;
	face_direction = sword_rotation_direction;
	$AnimationBody.rotation = rotation_offset;
	
	$AnimationBody/Hitbox/CollisionShape2D.disabled = true;
	
	await get_tree().physics_frame;
	
	Fighter.set_hitbox_collision($AnimationBody/Hitbox, user);

func _physics_process(delta: float) -> void:
	attacks_data[attack.left]["is_useable"] = true;
	attacks_data[attack.left]["can_attack"] = (is_visible_in_tree());
	attacks_data[attack.right]["is_useable"] = true;
	attacks_data[attack.right]["can_attack"] = (is_visible_in_tree());
	
	$AnimationBody/DaggerBody.visible = (is_bow == false);
	$AnimationBody/BowBody.visible = (is_bow == true);
	$AnimationBody/ArrowBody.visible = (is_bow == true) && (attacks_data[attack.left]["attack_cooldown"] <= 0.0);
	if (user.is_black == false):
		$AnimationBody/DaggerBody.color = Color.WHITE;
		$AnimationBody/BowBody.color = Color.WHITE;
		$AnimationBody/ArrowBody.color = Color.WHITE;
	else:
		$AnimationBody/DaggerBody.color = Color("#3a4466");
		$AnimationBody/BowBody.color = Color("#3a4466");
		$AnimationBody/ArrowBody.color = Color("#3a4466");
	
	$AnimationBody.rotation = rotation_offset;
	
	super(delta);


func on_main_attack_used() -> void:
	if (is_bow == false):
		var tween: Tween = create_tween();
		
		sword_rotation_direction *= -1;
		
		$AnimationBody/Hitbox.clear_hitted_hurtboxes();
		$AnimationBody/Hitbox/CollisionShape2D.disabled = false;
		
		tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(105), 0.2).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT);
		tween.tween_property(self, "face_direction", face_direction * -1, 0.0);
		tween.tween_property($AnimationBody/Hitbox/CollisionShape2D, "disabled", true, 0.0);
		tween.tween_property(self, "rotation_offset", sword_rotation_direction * deg_to_rad(90), 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN);
		attacks_data[attack.left]["attack_cooldown"] = 0.25 + 0.3;
		
		await tween.finished;
		
		attacks_data[attack.left]["is_attacking"] = false;
	else:
		var bullet: Actor = bullet_scene.instantiate();
		LevelData.current_level.get_node("%Bullets").add_child(bullet);
		bullet.global_position = $AnimationBody/BulletSpawn.global_position;
		bullet.movement_direction = aim_direction;
		bullet.user = user;
		
		attacks_data[attack.left]["attack_cooldown"] = 0.6;
		attacks_data[attack.left]["is_attacking"] = false;


func on_other_attack_used() -> void:
	is_bow = !is_bow;
	
	attacks_data[attack.left]["attack_cooldown"] = max(0.1, attacks_data[attack.left]["attack_cooldown"]);
	attacks_data[attack.right]["attack_cooldown"] = 0.1;
	attacks_data[attack.right]["is_attacking"] = false;
	
	if (is_bow == false):
		rotation_offset = sword_rotation_direction * PI / 2;
		face_direction = sword_rotation_direction;
		$AnimationBody.rotation = rotation_offset;
	else:
		rotation_offset = 0.0;
		face_direction = 1;
		$AnimationBody.rotation = rotation_offset;
