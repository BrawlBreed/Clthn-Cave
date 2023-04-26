class_name Fighter
extends Actor

@export var start_max_health: int = 3;
@export var movement_speed: float = 128.0

var is_player: bool;
var is_black: bool;

var is_moving: bool;

var weapon: FighterWeapon;

var health: HealthSystem;

var enemy_fighter: Fighter;

var hurted_tween: Tween;

var heal_cooldown: float;

var can_use_main_attack: bool;
var can_use_other_attack: bool;


@onready var weapon_pivot: Node2D = $WeaponPivot;
@onready var hurtbox: Hurtbox = $Hurtbox;


func _ready() -> void:
	health = HealthSystem.setup(start_max_health, self);
	health.damaged.connect(on_damaged);
	health.died.connect(on_died);
	hurtbox.health = health;
	
	if (weapon_pivot.get_child_count() > 0):
		weapon = weapon_pivot.get_child(0);
		weapon.setup(self);
	
	await get_tree().physics_frame;
	
	set_hurtbox_collision(hurtbox, self);

func _physics_process(delta: float) -> void:
	can_use_main_attack = false;
	can_use_other_attack = false;
	if (is_instance_valid(weapon)):
		if (weapon.attacks_data[FighterWeapon.attack.left]["is_attacking"] == false) && (weapon.attacks_data[FighterWeapon.attack.right]["is_attacking"] == false):
			can_use_main_attack = (weapon.attacks_data[FighterWeapon.attack.left]["attack_cooldown"] <= 0.0) && (weapon.attacks_data[FighterWeapon.attack.left]["is_useable"] == true) && (weapon.attacks_data[FighterWeapon.attack.left]["can_attack"] == true);
			can_use_other_attack = (weapon.attacks_data[FighterWeapon.attack.right]["attack_cooldown"] <= 0.0) && (weapon.attacks_data[FighterWeapon.attack.right]["is_useable"] == true) && (weapon.attacks_data[FighterWeapon.attack.right]["can_attack"] == true);
	
	if (is_player == true):
		var input_direction: Vector2 = get_input_direction();
		
		is_moving = move_in_direction(input_direction, movement_speed, 0.1, 0.1, false, delta);
		
		if (is_instance_valid(weapon)):
			weapon.aim_direction = weapon_pivot.global_position.direction_to(get_global_mouse_position());
		
		if (Input.is_action_just_pressed("action_main_attack")) && (can_use_main_attack == true):
			use_main_attack();
		
		if (Input.is_action_just_pressed("action_other_attack")) && (can_use_other_attack == true):
			use_other_attack();
		
		weapon_pivot.z_index = 2;
	else:
		weapon_pivot.z_index = 1;
	
	move_and_slide();
	
	if (health.current_health < health.max_health):
		heal_cooldown = move_toward(heal_cooldown, 0.0, delta);
		if (heal_cooldown <= 0.0):
			health.heal(1);
			
			heal_cooldown = 0.5;
	
	animation_main_sprite.frame = 0 if (is_black == false) else 1;


func use_main_attack() -> void:
	if (can_use_main_attack == true):
		weapon.use_attack(FighterWeapon.attack.left);
		
		can_use_main_attack = false;
		can_use_other_attack = false;

func use_other_attack() -> void:
	if (can_use_other_attack == true):
		weapon.use_attack(FighterWeapon.attack.right);
		
		can_use_main_attack = false;
		can_use_other_attack = false;


func get_input_direction() -> Vector2:
	return Vector2(
		Input.get_action_strength("move_right") - Input.get_action_strength("move_left"),
		Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
	)


func on_damaged(custom_data: Dictionary) -> void:
	if (is_instance_valid(hurted_tween)):
		hurted_tween.kill();
	hurted_tween = create_tween();
	
	animation_body.material.set_shader_parameter("fill_percent", 1.0);
	animation_body.material.set_shader_parameter("fill_color", Color.BLACK if (is_black == false) else Color.WHITE);
	hurted_tween.tween_property(animation_body.material, "shader_parameter/fill_percent", 0.0, 0.1).set_delay(0.15);
	
	heal_cooldown = 5.0;

func on_died(custom_data: Dictionary) -> void:
	visible = false;
	
	if (LevelData.current_level.player_fighter == self):
		LevelData.current_level.emit_signal("enemy_won");
	else:
		LevelData.current_level.emit_signal("player_won");


static func set_hitbox_collision(hitbox: Hitbox, user: Fighter) -> void:
	if (is_instance_valid(user)):
		hitbox.collision_mask = 16 if (user.is_player == true) else 8;

static func set_hurtbox_collision(hurtbox: Hurtbox, user: Fighter) -> void:
	if (is_instance_valid(user)):
		hurtbox.collision_layer = 8 if (user.is_player == true) else 16;
