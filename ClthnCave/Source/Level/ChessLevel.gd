extends Node2D

const max_battle_size: int = 3;

const tile_size: float = 42.0;

const white_icons_textures: Dictionary = {
	Level.piece_type.pawn: preload("res://Assets/Object/Pieces/PawnWhiteIcon.png"),
	Level.piece_type.rook: preload("res://Assets/Object/Pieces/RookWhiteIcon.png"),
	Level.piece_type.bishop: preload("res://Assets/Object/Pieces/BishopWhiteIcon.png"),
	Level.piece_type.knight: preload("res://Assets/Object/Pieces/KnightWhiteIcon.png"),
	Level.piece_type.queen: preload("res://Assets/Object/Pieces/QueenWhiteIcon.png"),
	Level.piece_type.king: preload("res://Assets/Object/Pieces/KingWhiteIcon.png"),
};

const black_icons_textures: Dictionary = {
	Level.piece_type.pawn: preload("res://Assets/Object/Pieces/PawnBlackIcon.png"),
	Level.piece_type.rook: preload("res://Assets/Object/Pieces/RookBlackIcon.png"),
	Level.piece_type.bishop: preload("res://Assets/Object/Pieces/BishopBlackIcon.png"),
	Level.piece_type.knight: preload("res://Assets/Object/Pieces/KnightBlackIcon.png"),
	Level.piece_type.queen: preload("res://Assets/Object/Pieces/QueenBlackIcon.png"),
	Level.piece_type.king: preload("res://Assets/Object/Pieces/KingBlackIcon.png"),
};


var stored_pieces: Array = [
	[],
	[],
]

var playing_pieces_state: Array;

var battle_choosen_index: int;


func _ready() -> void:
	randomize();
	
	$Level.CreateBoardUI(LevelData.is_enemy_black);
	$Buttons/ChooseBackground.visible = false;
	
	for button in $Buttons/PlayerPieces.get_children():
		button.button_up.connect(on_player_button_pressed.bind(button));
	
	for _index in max_battle_size:
		playing_pieces_state.push_back(0);


func store_pieces(player_piece: int, player_square: int, enemy_piece: int, enemy_square: int, is_player_attacking: bool) -> void:
	var button_index: int = stored_pieces[0].size();
	var player_button: BaseButton = $Buttons/PlayerPieces.get_child(button_index);
	var enemy_button: BaseButton = $Buttons/EnemyPieces.get_child(button_index);
	
	player_piece -= 1;
	enemy_piece -= 1;
	
	stored_pieces[0].push_back([player_piece, player_square, is_player_attacking, false]);
	stored_pieces[1].push_back([enemy_piece, enemy_square, !is_player_attacking, false]);
	
	player_button.global_position = $Level/BoardUI.global_position + get_square_position(player_square) * tile_size + Vector2.ONE * 5.0;
	player_button.icon = (white_icons_textures if (LevelData.is_enemy_black == true) else black_icons_textures)[player_piece];
	player_button.visible = true;
	player_button.disabled = true;
	enemy_button.global_position = $Level/BoardUI.global_position + get_square_position(enemy_square) * tile_size + Vector2.ONE * 5.0;
	enemy_button.icon = (black_icons_textures if (LevelData.is_enemy_black == true) else white_icons_textures)[enemy_piece];
	enemy_button.visible = true;
	enemy_button.disabled = true;
	
	if (stored_pieces[0].size() >= max_battle_size):
		stored_pieces[0].resize(max_battle_size);
		stored_pieces[1].resize(max_battle_size);
		
		start_choosing();
	elif (stored_pieces[0].back()[0] == Level.piece_type.king) || (stored_pieces[1].back()[0] == Level.piece_type.king):
		start_choosing();


func start_choosing() -> void:
	$Buttons/ChooseBackground.visible = true;
	$Level.CanMove = false;
	$Buttons/ReviveButton.visible = false;
	$Buttons/KillButton.visible = false;
	
	for button in $Buttons/PlayerPieces.get_children():
		button.disabled = false;


func on_player_button_pressed(button: BaseButton) -> void:
	var enemy_indexes: Array = range(stored_pieces[1].size()).filter(func(index: int): return (playing_pieces_state[index] == 0));
	
	battle_choosen_index = button.get_index();
	
	LevelData.player_piece_type = stored_pieces[0][battle_choosen_index][0];
	LevelData.enemy_piece_type = stored_pieces[1][battle_choosen_index][0];
	
	var battle_level: Level = preload("res://Source/Level/BattleLevel.tscn").instantiate();
	$Battle.add_child(battle_level);
	battle_level.player_won.connect(on_battle_finished);
	battle_level.player_won.connect(on_player_won);
	battle_level.enemy_won.connect(on_battle_finished);
	battle_level.enemy_won.connect(on_enemy_won);
	
	$Background.visible = false;
	$Level.visible = false;
	$Buttons.visible = false;
	$Buttons/ChooseBackground.visible = true;


func on_battle_finished() -> void:
	for node in $Battle.get_children():
		node.queue_free();
	
	$Buttons/ChooseBackground.visible = true;
	$Background.visible = true;
	$Level.visible = true;
	$Buttons.visible = true;
	
	await get_tree().physics_frame;
	
	var winning_state: int;
	
	var is_battle_done: bool = true;
	for piece_index in stored_pieces[0].size():
		if (playing_pieces_state[piece_index] == 0):
			is_battle_done = false;
			break;
		else:
			winning_state += playing_pieces_state[piece_index];
	
	if (is_battle_done == true):
		if (winning_state > 0):
			if (abs(winning_state) < stored_pieces[0].size()):
				$Buttons/ReviveButton.visible = true;
				$Buttons/KillButton.visible = true;
			else:
				update_after_battle();
		else:
			if (abs(winning_state) < stored_pieces[1].size()):
				for piece_index in stored_pieces[1].size():
					if (playing_pieces_state[piece_index] > 0):
						if (randf() >= 0.5): # Revive
							stored_pieces[1][piece_index][3] = true;
						else: # Kill
							stored_pieces[0][piece_index][3] = true;
						break;
			
			update_after_battle();

func on_player_won() -> void:
	var player_button: BaseButton = $Buttons/PlayerPieces.get_child(battle_choosen_index);
	var enemy_button: BaseButton = $Buttons/EnemyPieces.get_child(battle_choosen_index);
	
	playing_pieces_state[battle_choosen_index] = 1;
	
	player_button.visible = false;
	enemy_button.visible = false;

func on_enemy_won() -> void:
	var player_button: BaseButton = $Buttons/PlayerPieces.get_child(battle_choosen_index);
	var enemy_button: BaseButton = $Buttons/EnemyPieces.get_child(battle_choosen_index);
	
	playing_pieces_state[battle_choosen_index] = -1;
	
	player_button.disabled = true;
	enemy_button.disabled = true;


func _on_revive_button_button_up() -> void:
	for piece_index in stored_pieces[0].size():
		if (playing_pieces_state[piece_index] < 0):
			stored_pieces[0][piece_index][3] = true;
	
	update_after_battle();

func _on_kill_button_button_up() -> void:
	for piece_index in stored_pieces[0].size():
		if (playing_pieces_state[piece_index] < 0):
			stored_pieces[1][piece_index][3] = true;
	
	update_after_battle();

func update_after_battle() -> void:
	$Level.CanMove = true;
	$Level.gameState = 0;
	$Buttons/ChooseBackground.visible = false;
	$Buttons/ReviveButton.visible = false;
	$Buttons/KillButton.visible = false;
	
	for piece_index in stored_pieces[0].size():
		if (playing_pieces_state[piece_index] > 0):
			if (stored_pieces[1][piece_index][0] != Level.piece_type.king) || (stored_pieces[1][piece_index][3] == true):
				if (stored_pieces[0][piece_index][2] == true) && (stored_pieces[1][piece_index][3] == false):
					if (stored_pieces[0][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[1][piece_index][1], stored_pieces[0][piece_index][0] + 1, true);
					else:
						$Level.SetPiece(stored_pieces[1][piece_index][1], 0, true);
					
					$Level.SetPiece(stored_pieces[0][piece_index][1], 0, false);
				else:
					if (stored_pieces[0][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[0][piece_index][1], stored_pieces[0][piece_index][0] + 1, true);
					else:
						$Level.SetPiece(stored_pieces[0][piece_index][1], 0, true);
					
					if (stored_pieces[1][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[1][piece_index][1], 0, false);
					else:
						$Level.SetPiece(stored_pieces[1][piece_index][1], stored_pieces[1][piece_index][0] + 1, false);
			else:
				LevelData.last_game_state = 1;
				
				SceneTransition.change_scene(load("res://Source/Level/SelectMenu.tscn"), 0.5);
				break;
		else:
			if (stored_pieces[0][piece_index][0] != Level.piece_type.king) || (stored_pieces[0][piece_index][3] == true):
				if (stored_pieces[1][piece_index][2] == true) && (stored_pieces[0][piece_index][3] == false):
					$Level.SetPiece(stored_pieces[1][piece_index][1], 0, true);
					
					if (stored_pieces[1][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[0][piece_index][1], stored_pieces[1][piece_index][0] + 1, false);
					else:
						$Level.SetPiece(stored_pieces[0][piece_index][1], 0, false);
				else:
					if (stored_pieces[0][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[0][piece_index][1], 0, true);
					else:
						$Level.SetPiece(stored_pieces[0][piece_index][1], stored_pieces[0][piece_index][0] + 1, true);
					
					if (stored_pieces[1][piece_index][3] == false):
						$Level.SetPiece(stored_pieces[1][piece_index][1], stored_pieces[1][piece_index][0] + 1, false);
					else:
						$Level.SetPiece(stored_pieces[1][piece_index][1], 0, true);
			else:
				LevelData.last_game_state = -1;
				
				SceneTransition.change_scene(load("res://Source/Level/SelectMenu.tscn"), 0.5);
				break;
	
	stored_pieces[0].clear();
	stored_pieces[1].clear();
	for index in max_battle_size:
		playing_pieces_state[index] = 0;
	
	for button in ($Buttons/PlayerPieces.get_children() + $Buttons/EnemyPieces.get_children()):
		button.visible = false;


static func get_square_position(square: int) -> Vector2i:
	return Vector2i(square % 8, (square - (square % 8)) / 8);


