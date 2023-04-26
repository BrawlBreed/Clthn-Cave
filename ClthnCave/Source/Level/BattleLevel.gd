class_name Level
extends Node2D

enum piece_type {
	pawn,
	rook,
	bishop,
	knight,
	queen,
	king,
}

signal player_won();
signal enemy_won();

const pieces_fighters_scenes: Dictionary = {
	piece_type.pawn: preload("res://Source/Object/Fighter/Pawn/Pawn.tscn"),
	piece_type.rook: preload("res://Source/Object/Fighter/Rook/Rook.tscn"),
	piece_type.bishop: preload("res://Source/Object/Fighter/Bishop/Bishop.tscn"),
	piece_type.knight: preload("res://Source/Object/Fighter/Knight/Knight.tscn"),
	piece_type.queen: preload("res://Source/Object/Fighter/Queen/Queen.tscn"),
	piece_type.king: preload("res://Source/Object/Fighter/King/King.tscn"),
}

var player_fighter: Fighter;
var enemy_fighter: Fighter;



func _ready() -> void:
	player_fighter = pieces_fighters_scenes[LevelData.player_piece_type].instantiate();
	$Objects.add_child(player_fighter);
	player_fighter.global_position = $Fighter1Spawn.global_position;
	
	enemy_fighter = pieces_fighters_scenes[LevelData.enemy_piece_type].instantiate();
	$Objects.add_child(enemy_fighter);
	enemy_fighter.global_position = $Fighter2Spawn.global_position;
	
	LevelData.current_level = self;
	
	player_fighter.is_player = true;
	player_fighter.is_black = (LevelData.is_enemy_black == false);
	player_fighter.enemy_fighter = enemy_fighter;
	enemy_fighter.is_black = (LevelData.is_enemy_black == true);
	enemy_fighter.enemy_fighter = player_fighter;

func _physics_process(delta: float) -> void:
	if (is_instance_valid(player_fighter)):
		$UserInterface/PlayerHealthBar.max_value = player_fighter.health.max_health;
		$UserInterface/PlayerHealthBar.value = player_fighter.health.current_health;
		
		var weapon: FighterWeapon = player_fighter.weapon;
		var can_use_main_attack: bool;
		var can_use_other_attack: bool;
		if (is_instance_valid(weapon)):
			if (weapon.attacks_data[FighterWeapon.attack.left]["is_attacking"] == false) && (weapon.attacks_data[FighterWeapon.attack.right]["is_attacking"] == false):
				can_use_main_attack = (weapon.attacks_data[FighterWeapon.attack.left]["attack_cooldown"] <= 0.0) && (weapon.attacks_data[FighterWeapon.attack.left]["is_useable"] == true) && (weapon.attacks_data[FighterWeapon.attack.left]["can_attack"] == true);
				can_use_other_attack = (weapon.attacks_data[FighterWeapon.attack.right]["attack_cooldown"] <= 0.0) && (weapon.attacks_data[FighterWeapon.attack.right]["is_useable"] == true) && (weapon.attacks_data[FighterWeapon.attack.right]["can_attack"] == true);
			$UserInterface/PlayerMainAttackBar.visible = weapon.attacks_data[FighterWeapon.attack.left]["is_useable"];
			$UserInterface/PlayerOtherAttackBar.visible = weapon.attacks_data[FighterWeapon.attack.right]["is_useable"];
			
			$UserInterface/PlayerMainAttackBar.modulate = Color.WHITE if (can_use_main_attack == true) else Color(0.1, 0.1, 0.1);
			$UserInterface/PlayerOtherAttackBar.modulate = Color.WHITE if (can_use_other_attack == true) else Color(0.1, 0.1, 0.1);
		else:
			$UserInterface/PlayerMainAttackBar.visible = false;
			$UserInterface/PlayerOtherAttackBar.visible = false;
	else:
		$UserInterface/PlayerHealthBar.value = 0.0;
		$UserInterface/PlayerMainAttackBar.visible = false;
		$UserInterface/PlayerOtherAttackBar.visible = false;

