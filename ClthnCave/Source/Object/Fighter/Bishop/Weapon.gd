extends FighterWeapon

const bullet_scene: PackedScene = preload("res://Source/Object/Fighter/Bishop/Bullet.tscn");


func _physics_process(delta: float) -> void:
	attacks_data[attack.left]["is_useable"] = true;
	attacks_data[attack.left]["can_attack"] = (is_visible_in_tree());
	
	if (user.is_black == false):
		$AnimationBody/Body.color = Color.WHITE;
	else:
		$AnimationBody/Body.color = Color("#3a4466");
	
	super(delta);


func on_main_attack_used() -> void:
	var bullet: Actor = bullet_scene.instantiate();
	LevelData.current_level.get_node("%Bullets").add_child(bullet);
	bullet.global_position = $AnimationBody/BulletSpawn.global_position;
	bullet.movement_direction = aim_direction;
	bullet.user = user;
	bullet.queue_redraw();
	
	attacks_data[attack.left]["attack_cooldown"] = 1.0;
	attacks_data[attack.left]["is_attacking"] = false;
