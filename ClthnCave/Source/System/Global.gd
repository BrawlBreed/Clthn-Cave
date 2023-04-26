extends Node


static func create_shadow_sprite(
	sprite: Sprite2D, modulate_alpha: float, shadow_color: Color, shadow_color_percent: float,
	fade_time: float, fade_trans: Tween.TransitionType = Tween.TRANS_LINEAR, fade_ease: Tween.EaseType = Tween.EASE_IN, fade_delay: float = 0.0,
	parent: Node = null, is_duplicated: bool = true,
	) -> Sprite2D:
	if (!is_instance_valid(sprite)):
		return null;
	
	var shadow_sprite: Sprite2D = sprite;
	var shadow_material: = ShaderMaterial.new();
	if (is_duplicated == true):
		shadow_sprite = sprite.duplicate();
		shadow_sprite.global_position = sprite.global_position;
	var tween: Tween = sprite.create_tween();
	tween.set_parallel();
	
	if (is_instance_valid(parent)):
		if (is_instance_valid(shadow_sprite.get_parent())):
			shadow_sprite.get_parent().remove_child(shadow_sprite);
		parent.add_child(shadow_sprite);
	shadow_sprite.use_parent_material = false;
	shadow_sprite.material = shadow_material;
	
	shadow_material.shader = Loaded.fill_texture_shader_script;
	shadow_material.set_shader_parameter("fill_color", shadow_color);
	shadow_material.set_shader_parameter("fill_percent", shadow_color_percent);
	shadow_material.set_shader_parameter("alpha", modulate_alpha);
	tween.tween_property(shadow_material, "shader_parameter/alpha", 0.0, fade_time).set_trans(fade_trans).set_ease(fade_ease).set_delay(fade_delay);
	
	return shadow_sprite;
