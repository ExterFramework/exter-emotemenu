RegisterNetEvent('exter-emotemenu:sendAnimRequest:server', function(data)
    TriggerClientEvent('exter-emotemenu:receiveAnimRequest:client', data.id, data)
end)

RegisterNetEvent('exter-emotemenu:playAnimTogetherSender:server', function(data)
    TriggerClientEvent('exter-emotemenu:playAnimTogetherSender:client', data.data.target, data)
end)

RegisterNetEvent('exter-emotemenu:requstCanelledNotif:server', function(target)
    TriggerClientEvent('exter-emotemenu:requstCanelledNotif:client', target)
end)

RegisterNetEvent('exter-emotemenu:cancelEmote:server', function(target)
    TriggerClientEvent('exter-emotemenu:cancelEmote:client', target)
end)

RegisterNetEvent('exter-emotemenu:animDictLoaded:server', function(target)
    TriggerClientEvent('exter-emotemenu:animDictLoaded:client', target)
end)

RegisterNetEvent('exter-emotemenu:ptfxSync:server', function(asset, name, offset, rot, bone, scale, color)
    if type(asset) ~= "string" or type(name) ~= "string" or type(offset) ~= "vector3" or type(rot) ~= "vector3" then
        return
    end
    local srcPlayerState = Player(source).state
    srcPlayerState:set('ptfxAsset', asset, true)
    srcPlayerState:set('ptfxName', name, true)
    srcPlayerState:set('ptfxOffset', offset, true)
    srcPlayerState:set('ptfxRot', rot, true)
    srcPlayerState:set('ptfxBone', bone, true)
    srcPlayerState:set('ptfxScale', scale, true)
    srcPlayerState:set('ptfxColor', color, true)
    srcPlayerState:set('ptfxPropNet', false, true)
    srcPlayerState:set('ptfx', false, true)
end)

RegisterNetEvent("exter-emotemenu:ptfxSyncProp:server", function(propNet)
    local srcPlayerState = Player(source).state
    if propNet then
        local waitForEntityToExistCount = 0
        while waitForEntityToExistCount <= 100 and not DoesEntityExist(NetworkGetEntityFromNetworkId(propNet)) do
            Wait(10)
            waitForEntityToExistCount = waitForEntityToExistCount + 1
        end
        if waitForEntityToExistCount < 100 then
            srcPlayerState:set('ptfxPropNet', propNet, true)
            return
        end
    end
    srcPlayerState:set('ptfxPropNet', false, true)
end)

Citizen.CreateThread(function()
    if not Config.EnableResourceFileCleanup then
        return
    end

    local resourceList = {}
    for i = 0, GetNumResources() - 1, 1 do
        local resourceName = GetResourceByFindIndex(i)
        if resourceName and GetResourceState(resourceName) == "started" then
            resourceList[#resourceList + 1] = resourceName
        end
    end

    local foundResources = {}
    for _, resourceName in pairs(resourceList) do
        if string.match(resourceName, "smallresources") then
            foundResources[#foundResources + 1] = resourceName
        end
    end

    local filesToClean = {
        "client/handusp.lua",
        "client/crouchprone.lua"
    }

    for _, resourceName in pairs(foundResources) do
        local restartRequired = false
        local resPath = GetResourcePath(resourceName)
        for _, filePath in pairs(filesToClean) do
            local loadedFile = LoadResourceFile(resourceName, filePath)
            if loadedFile ~= nil then
                print("^0[^3WARNING^0] " .. GetCurrentResourceName() .. " ^1" .. resourceName .. "/" .. filePath .. " ^0file deleted by script.")
                os.remove(resPath .. "/" .. filePath)
                restartRequired = true
            end
        end

        if restartRequired then
            Citizen.Wait(500)
            StopResource(resourceName)
            Citizen.Wait(500)
            StartResource(resourceName)
        end
    end
end)

RegisterNetEvent('exter-emotemenu:convertCode:server', function(code, convertType)
    local src = source
    if not Config.EnableCodeConverter then
        return
    end
    if src ~= 0 and not IsPlayerAceAllowed(src, Config.CodeConverterAce) then
        return
    end
    if type(code) ~= "string" or type(convertType) ~= "string" or #code > 100000 then
        return
    end
    local type = string.lower(convertType)
    local tableString = "return {" .. code .. "}"
    local loadedFunction, errorMessage = load(tableString, "exter-emotemenu:convert", "t", {})
    if loadedFunction then
        local resultTable = loadedFunction()
        for key, value in pairs(resultTable) do
            if type == "expressions" or type == "walks" then
                local newTableString = '{\n    "' .. value[1] .. '",\n    "' .. key .. '",\n    "' .. string.lower(key) .. '",\n    ' .. 'imageId = "' .. string.lower(key) .. '"\n},'
                TriggerClientEvent('exter-emotemenu:copyCode:client', src, newTableString)
            elseif type == "dances" then
                local animationOptions = ""
                if value.AnimationOptions then
                    for optKey, optValue in pairs(value.AnimationOptions) do
                        animationOptions = animationOptions .. optKey .. " = " .. tostring(optValue) .. ", "
                    end
                    animationOptions = "{" .. animationOptions .. "}"
                end
                local newTableString = string.format('{\n    "%s",\n    "%s",\n    "%s",\n    "%s",\n    imageId = "%s",\n    AnimationOptions = %s\n},', key, value[3], value[1], value[2], string.lower(key), animationOptions)
                TriggerClientEvent('exter-emotemenu:copyCode:client', src, newTableString)
            elseif type == "emotes" then
                local animationOptions = ""
                if value.AnimationOptions then
                    for optKey, optValue in pairs(value.AnimationOptions) do
                        animationOptions = animationOptions .. optKey .. " = " .. tostring(optValue) .. ", "
                    end
                    animationOptions = "{" .. animationOptions .. "}"
                end
                local newTableString = string.format('{\n    "%s",\n    "%s",\n    "%s",\n    "%s",\n    imageId = "%s",\n    AnimationOptions = %s\n},', key, value[1], value[2], value[3], string.lower(key), animationOptions)
                print(newTableString)
                TriggerClientEvent('exter-emotemenu:copyCode:client', src, newTableString)
            end
        end
    else
        print("Error loading code: " .. errorMessage)
    end
end)

-- Citizen.CreateThread(function()
--     local path = GetResourcePath(GetCurrentResourceName())
--     local tempfile, err = io.open(path:gsub('//', '/')..'/'..string.gsub("test", ".lua", "")..'.lua', 'a+')
--     if tempfile then
--         tempfile:close()
--         path = path:gsub('//', '/')..'/'..string.gsub("test", ".lua", "")..'.lua'
--     end
--     local file = io.open(path, 'a+')
--     file:write("Exter.Dances = {")
--     for k, v in pairs(Exter.Dances) do
--         file:write("\n    {")
--         local str1 = ("\n        '%s',"):format(v[1])
--         file:write(str1)
--         local str2 = ("\n        '%s',"):format(v[2])
--         file:write(str2)
--         local str3 = ("\n        '%s',"):format(v[3])
--         file:write(str3)
--         local str4 = ("\n        '%s',"):format(v[4])
--         file:write(str4)
--         local str5 = ("\n        %s = '%s'"):format("imageId", "dance-" .. v[1]:sub(6))
--         file:write(str5)
--         file:write("\n    },")
--     end
--     file:write("\n}")
-- 	file:close()
-- end)
