extends Node

var current_level: Level;

var player_piece_type: Level.piece_type;
var enemy_piece_type: Level.piece_type;
var is_enemy_black: bool = true;
var level_board: Object;

var last_game_state: int;


func is_in_level() -> bool:
	return (is_instance_valid(current_level));
