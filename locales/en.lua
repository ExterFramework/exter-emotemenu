-- English
local Translations = {
    menu = {
        title = "ANIMATION MENU",
        description = "HERE YOU CAN MANAGE ALL SERVER ANIMATIONS",
        exit = "Exit"
    },
    notifications = {
        request_cancelled = "Request cancelled.",
        request_timed_out = "Request timed out.",
        no_players_nearby = "No players nearby.",
        no_emote_to_cancel = "No emote to cancel.",
        quick_slot_empty = "No anim found on slot %{slot}.",
        waiting_for_a_decision = "Waiting for a desicion. Cancel",
        already_playing_anim = "You're already playing an anim.",
        walk_style_is_set_default = "Your walking style is set as default."
    },
    categories = {
        all = "All",
        favorites = "Favorites",
        general = "General",
        dances = "Dances",
        expressions = "Expressions",
        walks = "Walks",
        placedemotes = "Placed Emotes",
        syncedemotes = "Synced Emotes",
        propemotes = "Prop Emotes"
    },
    keybinds = {
        toggle_point_description = "Toggles Point",
        ragdoll_description = "Ragdoll",
        play_quick_emote = "Play quick emote"
    },
    animations = {
        smoke = "Press ~y~G~w~ to smoke.",
        vape = "Press ~y~G~w~ to vape.",
        cut = "Press ~y~G~w~ to cut",
        makeitrain = "Press ~y~G~w~ to make it rain.",
        camera = "Press ~y~G~w~ to use camera flash.",
        spraychamp = "Hold ~y~G~w~ to spray champagne",
        useleafblower = "Press ~y~G~w~ to use the leaf blower.",
        poop = "Press ~y~G~w~ to poop",
        puke = "Press ~y~G~w~ to puke",
        firework = "Press ~y~G~w~ to use the firework",
        pee = "Hold ~y~G~w~ to pee."
    }
}

Lang = Lang or Locale:new({
    phrases = Translations,
    warnOnMissing = true
})