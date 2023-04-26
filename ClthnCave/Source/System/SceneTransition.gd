extends CanvasLayer

var transition_tween: Tween;


func _ready() -> void:
	$Color.modulate.a = 0.0;


func change_scene(scene: PackedScene, duration: float) -> void:
	if ((is_instance_valid(transition_tween)) && (transition_tween.is_valid())) || (!is_instance_valid(scene)) || (duration <= 0.0):
		return;
	transition_tween = create_tween();
	
	$Color.visible = true;
	$Color.modulate.a = 0.0;
	transition_tween.tween_property($Color, "modulate:a", 1.0, duration / 2.0 + 0.05);
	transition_tween.tween_property($Color, "modulate:a", 0.0, duration / 2.0 - 0.05).set_delay(0.05);
	
	await get_tree().create_timer(duration / 2.0).timeout;
	
	get_tree().change_scene_to_packed(scene);

func reload_scene(duration: float) -> void:
	if ((is_instance_valid(transition_tween)) && (transition_tween.is_valid())) || (duration <= 0.0):
		return;
	transition_tween = create_tween();
	
	$Color.visible = true;
	$Color.modulate.a = 0.0;
	transition_tween.tween_property($Color, "modulate:a", 1.0, duration / 2.0 + 0.05);
	transition_tween.tween_property($Color, "modulate:a", 0.0, duration / 2.0 - 0.05).set_delay(0.05);
	
	await get_tree().create_timer(duration / 2.0).timeout;
	
	get_tree().reload_current_scene();
