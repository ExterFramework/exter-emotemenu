Config = {
    ServerCallbacks = {}, -- Don't edit or change
    EnableResourceFileCleanup = false, -- Removes legacy conflicting files from known resources when enabled.
    EnableCodeConverter = false, -- Developer helper. Keep disabled on production servers.
    CodeConverterAce = "exter.emotemenu.convertcode", -- Required ACE permission when code converter is enabled.
    MenuKey = 'F3',
    CanOpenMenu = function()
        if IsPedDeadOrDying(PlayerPedId(), true) then
            return false
        end
        return true
    end,
    PropTimeout = 2000,
    AllowMovement = false, -- By activating this, you enable the player to move while the menu is open.
    AnimPosForAllAnimations = true,
    MaxDistanceForAnimPos = 15.0,
    CancelWalk = true, -- Resets movement type when using the /e c command
    EnableXtoCancel = true,  -- Set this to false if you have something else on X (default X), and then just use /e c to cancel emotes.
    CancelEmoteKey = 'X', -- Get the button string here https://docs.fivem.net/docs/game-references/input-mapper-parameter-ids/keyboard/
    AllowedInCars = true, -- Set this if you really wanna disable emotes in cars, as of 1.7.2 they only play the upper body part if in vehicle
    QuickPrimaryKey = 'LSHIFT', -- The primary key name to be used to play the quick animations, for example, the key you specify and the quick animation number to be played will be pressed (LSHIFT + 1, LSHIFT + 2). Check here for more keys https://docs.fivem.net/docs/game-references/controls/.
    -- Pointing
    PointingEnabled = true,
    PointingKeybind = 'B',
    CanPoint = function()
        if IsPedArmed(PlayerPedId(), 4) then
            return false
        end
        return true
    end,
    -- Crouching
    CrouchingEnabled = true, -- Default Key (Left CTRL)
    CanCrouch = function()
        if IsPedArmed(PlayerPedId(), 4) then
            return false
        end
        return true
    end,
    -- Ragdoll
    RagdollEnabled = true,
    RagdollKeybind = 'U',
    CanRagdoll = function()
        if IsPedArmed(PlayerPedId(), 4) then
            return false
        end
        return true
    end,
    Notify = function(text, length, type)
        TriggerEvent('QBCore:Notify', text, type, length)
    end,
    -- Hands Up (Hands Up key is same with CancelEmoteKey)
    EnableHandsUp = true,
    CanHandsup = function()
        -- Example usage for qb-policejob
        if GetResourceState('qb-policejob') == "started" then
            if exports['qb-policejob']:IsHandcuffed() then return false end
        end
        return true
    end,
    HandsupDisableControls = function()
        -- Example usage for qb-smallresources
        if GetResourceState('qb-smallresources') == "started" then
            exports['qb-smallresources']:addDisableControls({24, 25, 47, 58, 59, 63, 64, 71, 72, 75, 140, 141, 142, 143, 257, 263, 264})
        end
    end,
    HandsupEnableControls = function()
        -- Example usage for qb-smallresources
        if GetResourceState('qb-smallresources') == "started" then
            exports['qb-smallresources']:removeDisableControls({24, 25, 47, 58, 59, 63, 64, 71, 72, 75, 140, 141, 142, 143, 257, 263, 264})
        end
    end,
    -- Text UI Functions
    Create3DTextUIOnPlayer = function(name, data)
        exports['exter-textui']:create3DTextUIOnPlayers(name, data)
    end,
    Delete3DTextUIOnPlayer = function(name)
        exports['exter-textui']:delete3DTextUIOnPlayers(name)
    end,
    ShowTextUI = function(name, key)
       -- exports["exter-textui"]:displayTextUI(name, key)
    end,
    HideTextUI = function()
       -- exports["exter-textui"]:hideTextUI()
    end
}
