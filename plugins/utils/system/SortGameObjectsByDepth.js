var SortGameObjectsByDepth = function (gameObjects, descending) {
    if (gameObjects.length <= 1) {
        return gameObjects;
    }

    if (descending === undefined) {
        descending = false;
    }

    var displayList = gameObjects[0].displayList;
    if (displayList)
        displayList.depthSort();

    if (descending) {
        gameObjects.sort(function (childA, childB) {
            if (displayList)
                return displayList.getIndex(childB) - displayList.getIndex(childA);
            else return 0;
        })
    } else {
        gameObjects.sort(function (childA, childB) {
            if (displayList)
                return displayList.getIndex(childA) - displayList.getIndex(childB);
            else return 0;
        })
    }

    return gameObjects;
}

export default SortGameObjectsByDepth;