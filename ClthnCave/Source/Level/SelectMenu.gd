extends Control

func _ready() -> void:
	_on_check_button_toggled(false);


func _on_check_button_toggled(button_pressed: bool) -> void:
	LevelData.is_enemy_black = !button_pressed;


func _on_start_button_pressed() -> void:
	SceneTransition.change_scene(preload("res://Source/Level/ChessLevel.tscn"), 0.5);


func _on_quit_button_pressed() -> void:
	get_tree().quit();
