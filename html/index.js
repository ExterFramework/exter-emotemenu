menuOpen = false;
animPosOpen = false;
animations = [];
quickAnimations = [];
currentCategory = null;
currentCategoryAnims = [];
favoriteAnimations = [];
translations = [];
XEMOTES = []
let pKey = null;
let down = 1;
let defaultScrollTop = 7.8;
let defaultScrollValue = 0.268;
let currentRangeStart = 0;
let currentRangeEnd = 21;
const EMOTE_SLICE_SIZE = 21;
const scrollbarDiv = document.getElementById("scrollbar");
window.addEventListener('message', function(event) {
    ed = event.data;
    if (ed.action === "menu") {
        menuOpen = ed.state;
        // let display = ed.state == true && "flex" || "none";
        if (menuOpen) {
            translations = ed.translations;
            document.getElementById("menuTitle").innerHTML=translations.title;
            document.getElementById("menuDescription").innerHTML=translations.description;
            document.getElementById("mainDivInsideTopCloseLeft").innerHTML=`<span>${translations.exit}</span>`;
            $("#mainDiv").fadeIn().css({bottom: "-200%", position:'absolute', display: 'flex'}).animate({bottom: "0"}, 400, function() {});
            if (favoriteAnimations.length >= 1) {
                if (document.getElementById("MDLSBCategoryDiv-favorites")) {
                    document.getElementById("MDLSBCategoryDiv-favorites").style.display = "flex";
                }
            } else {
                if (document.getElementById("MDLSBCategoryDiv-favorites")) {
                    document.getElementById("MDLSBCategoryDiv-favorites").style.display = "none";
                }
            }
            if (ed.menu) {
                clFunc('chooseCategory', ed.menu, ed.menuNum);
            }
        } else {
            $("#mainDiv").css({bottom: "0", position:'absolute', display: 'flex'}).animate({bottom: "-200%"}, 400, function() {
                $("#mainDiv").fadeOut();
            });
        }
    } else if (ed.action === "openInfoMenu") {
        animPosOpen = ed.state;
        if (animPosOpen) {
            $("#animPosInfoDiv").show().css({bottom: "-10%", position:'absolute', display:'flex'}).animate({bottom: "2%"}, 500, function() {});
        } else {
            $("#animPosInfoDiv").css({bottom: "2%", position:'absolute', display: 'flex'}).animate({bottom: "-10%"}, 400, function() {
                $("#animPosInfoDiv").fadeOut();
            });
        }
    } else if (ed.action === "setData") {
		animations = ed.animations;
        favoriteAnimations = ed.favs;
		document.getElementById("mainDivLeftSideBottom").innerHTML="";
		ed.categories.forEach(function(categoryData, index) {
            let url = IapU(EvhR(categoryData.image));
			var categoryHTML = `
			<div class="MDLSBCategoryDiv" id="MDLSBCategoryDiv-${categoryData.name}" onclick="clFunc('chooseCategory', '${categoryData.name}', '${categoryData.number}')">
				<div id="MDLSBCategoryDivImgDiv">
					<img src="${url}" style="width: ${categoryData.width}vw;">
				</div>
				<div id="MDLSBCategoryDivTexts"><h4>${categoryData.label}</h4><h4 id="MDLSBCategoryDivTexts2-${categoryData.name}">${categoryData.number} Animations</h4></div>
			</div>`;
			appendHtml(document.getElementById("mainDivLeftSideBottom"), categoryHTML);
			if (currentCategory === null) {
				currentCategory = categoryData.name;
				clFunc('chooseCategory', categoryData.name, categoryData.number);
			}
		});
        pKey = ed.pKey;
        let quickAnimations2 = ed.quicks;
        quickAnimations2.forEach(function(quickData, index) {
            let category = quickData.category;
            if (category === "general") {category = "emotes"};
            let src = IapU(EXiU(category, quickData.imgId));
            if (category === "placedemotes" || category == "syncedemotes") {src = "files/unknown.png"};
            document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${quickData.slot}`).innerHTML=`
            <div class="mainDivRightSideBottomTopDiv mainDivRightSideBottomTopDivSlot">
                <div class="MDRSBTDTopDiv" style="height: 0;"></div>
                <img class="mainDivRightSideBottomTopDivWEBP" src="${src}" style="bottom: 25%; width: 3vw;">
                <div id="MDRSBTDBottomDiv" style="padding-top: 0; position: absolute; left: 0; right: 0; bottom: 8%; margin: auto;"><span>${quickData.label}</span></div>
            </div>
            <div class="mainDivRightSideBottomTopDiv2KeyDiv">${pKey} + ${quickData.slot}</div>`;
            // $(`#mainDivRightSideBottomBottomDiv-Slot${quickData.slot}`).attr("data-slot", quickData.slot)
            document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${quickData.slot}`).addEventListener("click", function(e) {clFunc('playAnim', quickData.animId, quickData.category)}, false);
            quickAnimations[quickData.slot] = {
                id: quickData.id,
                name: quickData.name,
                label: quickData.label,
                category: quickData.category,
                imgId: quickData.imgId,
                slot: quickData.slot,
                animId: quickData.animId
            };
        });
        handleDragDrop();
        if (ed.sender === "extercity") {
            post({action: "dataReady"});
        }
	} else if (ed.action === "resetQuicks") {
        quickAnimations = [];
    } else if (ed.action === "copyCode") {
		const el = document.createElement("textarea");
		el.value = ed.code;
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
    } else if (ed.action === "propTimeout") {
        if (currentCategory === "propemotes") {
            if (ed.state === true) {
                document.querySelectorAll('.mainDivRightSideBottomTopDivDraggable').forEach(animDiv => {
                    animDiv.style.opacity = 0.5;
                });
            } else {
                document.querySelectorAll('.mainDivRightSideBottomTopDivDraggable').forEach(animDiv => {
                    animDiv.style.opacity = 1.0;
                });
            }
        }
    }
    document.onkeyup = function(data) {
		if (data.which == 27 && menuOpen) {
			menuOpen = false;
            $("#mainDiv").css({bottom: "0", position:'absolute', display: 'flex'}).animate({bottom: "-200%"}, 400, function() {
                $("#mainDiv").fadeOut();
            });
            post({action: "close"});
		}
        if (data.which == 27 && animPosOpen) {
			animPosOpen = false;
            $("#animPosInfoDiv").css({bottom: "2%", position:'absolute', display: 'flex'}).animate({bottom: "-10%"}, 400, function() {
                $("#animPosInfoDiv").fadeOut();
            });
            post({action: "closeAnimPos"});
		}
	}
})

function clFunc(name1, name2, name3, name4, name5, name6) {
	if (name1 === "chooseCategory") {
		if (currentCategory) {
			document.getElementById(`MDLSBCategoryDiv-${currentCategory}`).classList.remove("MDLSBCategoryDivActive");
		}
        totalItems = Number(name3);
		currentCategory = name2;
        scrollbarDiv.style.top = defaultScrollTop +  "%";
        currentRangeStart = 0;
        currentRangeEnd = 21;
        document.getElementById(`MDLSBCategoryDiv-${name2}`).classList.add("MDLSBCategoryDivActive");
        if (name2 === "favorites") {
            document.getElementById("mainDivRightSideBottomTop").innerHTML="";
            document.getElementById("mainDivRightSideBottomTop").scrollTop = 0;
            favoriteAnimations.forEach(function(favData, index) {
                let name = "/e " + favData.name;
                if (name.length > 9) {name = name.slice(0, 9) + "..."};
                let category = favData.category;
                if (favData.category === "general") {category = "emotes"};
                let src = IapU(EXiU(category, favData.imgId));
                if (category === "placedemotes" || category == "syncedemotes") {src = "files/unknown.png"};
                $(`#mainDivRightSideBottomTopDiv-${favData.id}`).hover(function() {
                    $(`#MDRSBTDTopDivCommand-${favData.id}`).html(`<h4>/e ${favData.name}</h4>`);
                }, function() {
                    $(`#MDRSBTDTopDivCommand-${favData.id}`).html(`<h4>${name}</h4>`);
                });
                var animHTML = `
                <div class="mainDivRightSideBottomTopDiv mainDivRightSideBottomTopDivDraggable" id="mainDivRightSideBottomTopDiv-${favData.id}">
                    <div id="MDRSBTDTopDiv-${favData.id}" class="MDRSBTDTopDiv MDRSBTDTopDivFav">
                        <img onclick="clFunc('addAnimToFavorites', '${favData.id}')">
                        <div class="MDRSBTDTopDivCommand" onclick="clFunc('playAnim', '${favData.animId}', '${favData.category}')"><h4>${name}</h4></div>
                    </div>
                    <img class="mainDivRightSideBottomTopDivWEBP" src=${src} onclick="clFunc('playAnim', '${favData.animId}', '${favData.category}')">
                    <div id="MDRSBTDBottomDiv" onclick="clFunc('playAnim', '${favData.animId}', '${favData.category}')"><span>${favData.label}</span></div>
                    <div id="MDRSBTDBottomLineDiv" onclick="clFunc('playAnim', '${favData.animId}', '${favData.category}')"></div>
                </div>`;
                appendHtml(document.getElementById("mainDivRightSideBottomTop"), animHTML);
                $(`#mainDivRightSideBottomTopDiv-${favData.id}`).data("animData", favData);
            });
            handleDragDrop();
            return
        }
		if (name2 === "all") {
			currentCategoryAnims = animations;
            XEMOTES = animations;
            defaultScrollValue = 0.268;
		} else {
			currentCategoryAnims = [];
            XEMOTES = [];
			animations.forEach(function(animData, index) {
				if (animData.category === name2) {
					currentCategoryAnims.push({
						id: animData.id,
						name: animData.name,
						label: animData.label,
						category: animData.category,
						imgId: animData.imgId,
                        animId: animData.animId
					});
                    XEMOTES.push({
						id: animData.id,
						name: animData.name,
						label: animData.label,
						category: animData.category,
						imgId: animData.imgId,
                        animId: animData.animId
					});
				}
			});
            defaultScrollValue = 70 / (currentCategoryAnims.length / 21) - 0.30;
		}
        // defaultScrollValue = (window.innerHeight / currentCategoryAnims.length * 162) * 0.268;
        setTimeout(() => {
            updateRange();
        }, 100);
	} else if (name1 === "addAnimToFavorites") {
        let existingFavAnim = favoriteAnimations.find(item => item.id === Number(name2));
        if (existingFavAnim) {
            favoriteAnimations = favoriteAnimations.filter(item => item.id !== Number(name2));
            playSound("CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE");
            document.getElementById(`MDRSBTDTopDiv-${Number(name2)}`).classList.remove("MDRSBTDTopDivFav");
            if (document.getElementById(`mainDivRightSideBottomTopDiv-${Number(name2)}`)) {
                document.getElementById(`mainDivRightSideBottomTopDiv-${Number(name2)}`).remove();
            }
            document.getElementById(`MDLSBCategoryDivTexts2-favorites`).innerHTML=`${favoriteAnimations.length} Animations`;
            post({action: "saveFavAnims", favoriteAnimations: favoriteAnimations});
        } else {
            let existingAnim = currentCategoryAnims.find(item => item.id === Number(name2));
            if (existingAnim) {
                favoriteAnimations.push({
                    id: existingAnim.id,
                    name: existingAnim.name,
                    label: existingAnim.label,
                    category: existingAnim.category,
                    imgId: existingAnim.imgId,
                    animId: existingAnim.animId
                });
                playSound("CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE");
                post({action: "saveFavAnims", favoriteAnimations: favoriteAnimations});
                document.getElementById(`MDLSBCategoryDivTexts2-favorites`).innerHTML=`${favoriteAnimations.length} Animations`;
                document.getElementById(`MDRSBTDTopDiv-${existingAnim.id}`).classList.add("MDRSBTDTopDivFav");
            }
        }
        if (favoriteAnimations.length >= 1) {
            document.getElementById("MDLSBCategoryDiv-favorites").style.display = "flex";
        } else {
            document.getElementById("MDLSBCategoryDiv-favorites").style.display = "none";
        }
    } else if (name1 === "playAnim") {
        playSound("CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE");
        post({action: "playAnim", id: Number(name2), category: name3});
    }
}

function appendHtml(el, str) {
	var div = document.createElement('div');
	div.innerHTML = str;
	while (div.children.length > 0) {
		el.appendChild(div.children[0]);
	}
}

const downScrollBar = (e) => {
    const scrollbarDiv = document.getElementById("scrollbar");
    const parentDiv = scrollbarDiv.offsetParent;
    const computedStyle = window.getComputedStyle(scrollbarDiv);
    const currentTopPx = parseFloat(computedStyle.top);
    const parentHeight = parentDiv.clientHeight;
    const currentTopPercent = (currentTopPx / parentHeight) * 100;
    const newTopPercent = (e * down) + currentTopPercent;
    scrollbarDiv.style.top = `${newTopPercent}%`;
}

const upScrollBar = (e) => {
    const scrollbarDiv = document.getElementById("scrollbar");
    const parentDiv = scrollbarDiv.offsetParent;
    const computedStyle = window.getComputedStyle(scrollbarDiv);
    const currentTopPx = parseFloat(computedStyle.top);
    const parentHeight = parentDiv.clientHeight;
    const currentTopPercent = (currentTopPx / parentHeight) * 100;
    const newTopPercent = currentTopPercent - (e * down);
    scrollbarDiv.style.top = `${newTopPercent}%`;
}

updateRange();
document.getElementById('mainDivRightSideBottomTop').addEventListener('wheel', function(event) {
    event.preventDefault();
    if (event.deltaY >= 0) {
        if (currentRangeEnd > XEMOTES.length) {
            currentRangeStart = 0;
            currentRangeEnd = 21;
            scrollbarDiv.style.top = defaultScrollTop +  "%";
            return updateRange()
        }
        currentRangeStart += EMOTE_SLICE_SIZE;
        currentRangeEnd += EMOTE_SLICE_SIZE;
        downScrollBar(defaultScrollValue);
        updateRange();
    } else if (event.deltaY < 0) {
        if (currentRangeStart <= 0) {
            currentRangeStart = 0;
            currentRangeEnd = 21;
            scrollbarDiv.style.top = defaultScrollTop +  "%";
            return updateRange()
        }
        currentRangeStart -= EMOTE_SLICE_SIZE;
        currentRangeEnd -= EMOTE_SLICE_SIZE;
        upScrollBar(defaultScrollValue);
        updateRange()
    }
});
document.getElementById('mainDivRightSideBottomTop').setAttribute('tabindex', '0');

function getArraySlice(array, startIndex, endIndex) {
    return array.slice(startIndex, Math.min(endIndex, array.length) + 7);
}

function createStaticImageFromGif(gifUrl, callback) {
    var img = new Image();
    checkIfImageExists(gifUrl, function(imgExists) {
        if (imgExists === false) {
            img.src = 'files/unknown.png';
            callback('files/unknown.png');
        }
    })
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var staticImageUrl = canvas.toDataURL("image/png");
        callback(staticImageUrl);
    };
    img.src = gifUrl;
}

function updateContent(emotes) {
    document.getElementById('mainDivRightSideBottomTop').innerHTML = '';
    const fragment = document.createDocumentFragment();
    emotes.forEach((item, index) => {
        let existingAnim = currentCategoryAnims.find(animation => animation.id === item.id);
        if (existingAnim) {
            let name = "/e " + item.name;
            if (name.length > 9) { name = name.slice(0, 9) + "..." };
            // Fav Exists
            let dclass = "";
            let existingFavAnim = favoriteAnimations.find(animation => animation.id === item.id);
            if (existingFavAnim) { dclass = "MDRSBTDTopDivFav" };
            let category = item.category;
            if (item.category === "general" || item.category === "propemotes") { category = "emotes" };
            let src = IapU(EXiU(category, item.imgId));
            if (category === "placedemotes" || category == "syncedemotes") { src = "files/unknown.png" };
            const divItem = document.createElement('div');
            //divItem.addEventListener("click", function(e) {clFunc('playAnim', item.animId, item.category)}, false);
            divItem.classList.add('mainDivRightSideBottomTopDiv');
            divItem.classList.add('mainDivRightSideBottomTopDivDraggable');
            // divItem.id = `mainDivRightSideBottomTopDiv-${item.id}`;
            // $(`mainDivRightSideBottomTopDiv-${item.id}`).data("animData", existingAnim);
            $(divItem).data("animData", item);
            $(divItem).hover(function () {
                $(`#MDRSBTDTopDivCommand-${item.id}`).html(`<h4>/e ${item.name}</h4>`);
            }, function () {
                $(`#MDRSBTDTopDivCommand-${item.id}`).html(`<h4>${name}</h4>`);
            });
            divItem.innerHTML = `
            <div id="MDRSBTDTopDiv-${item.id}" class="MDRSBTDTopDiv ${dclass}">
                <img onclick="clFunc('addAnimToFavorites', '${item.id}')">
                <div class="MDRSBTDTopDivCommand" id="MDRSBTDTopDivCommand-${item.id}" onclick="clFunc('playAnim', '${item.animId}', '${item.category}')"><h4>${name}</h4></div>
            </div>`;
            createStaticImageFromGif(src, function(staticImageUrl) {
                const img = new Image();
                img.src = staticImageUrl;
                img.classList.add('mainDivRightSideBottomTopDivWEBP');
                img.addEventListener("mouseenter", function () {
                    img.src = src;
                });
                img.addEventListener("mouseleave", function () {
                    img.src = staticImageUrl;
                });
                img.onerror = function() {
                    img.src = 'files/unknown.png';
                };
                img.setAttribute("onclick", `clFunc('playAnim', '${item.animId}', '${item.category}')`);
                divItem.appendChild(img);
            });
            divItem.innerHTML += `
                <div id="MDRSBTDBottomDiv" onclick="clFunc('playAnim', '${item.animId}', '${item.category}')"><span>${item.label}</span></div>
                <div id="MDRSBTDBottomLineDiv" onclick="clFunc('playAnim', '${item.animId}', '${item.category}')"></div>`;
            fragment.appendChild(divItem);
        }
    });
    document.getElementById('mainDivRightSideBottomTop').appendChild(fragment);
    handleDragDrop();
    setTimeout(() => {
        document.getElementById("mainDivRightSideBottomTop").scrollTop = 0;
    }, 150);
}

function checkIfImageExists(url, callback) {
	const img = new Image();
	img.src = url;
	if (img.complete) {
		callback(true);
	} else {
		img.onload = () => {
			callback(true);
		};
		img.onerror = () => {
			callback(false);
		};
	}
}

function updateRange() {
    let newEmoteRange = getArraySlice(XEMOTES, currentRangeStart, currentRangeEnd);
    updateContent(newEmoteRange);
}

const inputElement = document.getElementById('MDBSearchInput');
inputElement.addEventListener('input', function(event) {
    const userInput = event.target.value;
    if (userInput.length !== 0) {
        XEMOTES = findEmoteByPartialLabel(currentCategoryAnims, userInput);
        currentRangeStart = 0;
        currentRangeEnd = 21;
        updateRange()
    } else {
        XEMOTES = currentCategoryAnims;
        currentRangeStart = 0;
        currentRangeEnd = 21;
        updateRange()
    }
});

document.getElementById("MDBSearchInput").addEventListener("focusin", (event) => {
    post({action: "disableMovement"});
});

document.getElementById("MDBSearchInput").addEventListener("focusout", (event) => {
    post({action: "enableMovement"});
});

function findEmoteByPartialLabel(emotes, partialLabel) {
    const matchingLabels = emotes.filter(emote => 
        emote.label.toLowerCase().includes(partialLabel.toLowerCase()) || emote.name.toLowerCase().includes(partialLabel.toLowerCase())
    )
    return matchingLabels;
}

function playSound(sound, type) {
    post({action: "playSound", sound: sound, type: type});
}

IsDragging = false;
function handleDragDrop() {
    // Normal
    $(".mainDivRightSideBottomTopDivDraggable").draggable({
        helper: "clone",
        appendTo: "body",
        scroll: false,
        revertDuration: 0,
        revert: "invalid",
        start: function (event, ui) {
            IsDragging = true;
            let data = $(this).data("animData");
            let dclass = "";
            let existingFavAnim = favoriteAnimations.find(animation2 => animation2.id === data.id);
            if (existingFavAnim) {dclass = "MDRSBTDTopDivFav"};
            let name2 = "/e " + data.name;
            if (name2.length > 9) {name2 = name2.slice(0, 9) + "..."};
            $(ui.helper).html(`
            <div id="MDRSBTDTopDiv-${data.id}" class="MDRSBTDTopDiv ${dclass}">
                <img>
                <div class="MDRSBTDTopDivCommand" id="MDRSBTDTopDivCommand-${data.id}"><h4>${name2}</h4></div>
            </div>
            <div id="MDRSBTDBottomDiv"><span>${data.label}</span></div>
            <div id="MDRSBTDBottomLineDiv"></div>`)
            $(ui.helper).css({
                width: $(this).width(),
                height: $(this).height()
            });
            document.getElementById("mainDivRightSideBottomTopImp").style.display = "block";
        },
        stop: function () {
            setTimeout(function () {
                IsDragging = false;
                document.getElementById("mainDivRightSideBottomTopImp").style.display = "none";
            }, 300);
        },
    });
    $(".mainDivRightSideBottomTopDiv2").droppable({
        accept: ".mainDivRightSideBottomTopDiv",
        drop: function (event, ui) {
            setTimeout(function () {
                IsDragging = false;
            }, 300);
            fromData = ui.draggable.data("animData");
            addAnimToQuick(fromData, Number($(this).attr("data-slot")));
        },
    });
    //
    $(".mainDivRightSideBottomTopDiv2").draggable({
        helper: "clone",
        appendTo: "body",
        scroll: false,
        revertDuration: 0,
        revert: "invalid",
        start: function (event, ui) {
            currentQuickDragSlot = Number($(this).attr("data-slot"));
            if (quickAnimations[currentQuickDragSlot]) {
                IsDragging = true;
                $(ui.helper).css({
                    width: $(this).width(),
                    height: $(this).height()
                });
                document.getElementById("mainDivRightSideBottomTopImp").style.display = "block";
            } else {
                event.preventDefault();
            }
        },
        stop: function () {
            setTimeout(function () {
                IsDragging = false;
                document.getElementById("mainDivRightSideBottomTopImp").style.display = "none";
            }, 300);
        },
    });
    $("#mainDivRightSideBottomTopImp").droppable({
        accept: ".mainDivRightSideBottomTopDiv2",
        drop: function (event, ui) {
            setTimeout(function () {
                IsDragging = false;
            }, 300);
            removeAnimFromQuick(currentQuickDragSlot);
        },
    });
}

function addAnimToQuick(data, id) {
    if (quickAnimations[id]) {quickAnimations[id] = null};
    quickAnimations[id] = {
        id: data.id,
        name: data.name,
        label: data.label,
        category: data.category,
        imgId: data.imgId,
        slot: id,
        animId: data.animId
    };
    let category = data.category;
    if (category === "general") {category = "emotes"};
    let src = IapU(EXiU(category, data.imgId));
    if (category === "placedemotes" || category == "syncedemotes") {src = "files/unknown.png"};
    // document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${id}`).classList.add("mainDivRightSideBottomTopDivQuick");
    document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${id}`).innerHTML=`
    <div class="mainDivRightSideBottomTopDiv mainDivRightSideBottomTopDivSlot">
        <div class="MDRSBTDTopDiv" style="height: 0;"></div>
        <img class="mainDivRightSideBottomTopDivWEBP" src="${src}" style="bottom: 25%; width: 3vw;">
        <div id="MDRSBTDBottomDiv" style="padding-top: 0; position: absolute; left: 0; right: 0; bottom: 8%; margin: auto;"><span>${data.label}</span></div>
    </div>
    <div class="mainDivRightSideBottomTopDiv2KeyDiv">${pKey} + ${id}</div>`;
    document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${id}`).addEventListener("click", function(e) {clFunc('playAnim', data.animId, data.category)}, false);
    post({action: "saveQuickAnims", quickAnimations: quickAnimations});
    playSound("CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE");
}

function removeAnimFromQuick(id) {
    if (quickAnimations[id]) {quickAnimations[id] = null};
    document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${id}`).innerHTML=`<div class="mainDivRightSideBottomTopDiv mainDivRightSideBottomTopDivSlot"></div>`;
    document.getElementById(`mainDivRightSideBottomBottomDiv-Slot${id}`).addEventListener("click", function(e) {}, false);
    post({action: "saveQuickAnims", quickAnimations: quickAnimations});
    playSound("CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE");
}

function post(data) {
    var xhr = new XMLHttpRequest();
	xhr.open("POST", `https://${GetParentResourceName()}/callback`, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}