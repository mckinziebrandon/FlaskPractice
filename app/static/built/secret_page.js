const ROOT_PATH = '/';
const ENTER_KEY = 13;
function validRef(r) {
    if (r) {
        return r.search(/\.|#|\$|\[|\]/) === -1;
    }
    return false;
}
$(document).ready(function () {
    // Grab our database.
    let database = firebase.database();
    // Reference object to our database root.
    let rootRef = database.ref(ROOT_PATH);
    // Grab our DOM elements (inputs).
    let keyInput = $('#key');
    let valInput = $('#value');
    let display = $('#key-value-display');
    let submitBtn = $('.btn-submit');
    let deleteGroup = $('#delete-key');
    let wordFreq = new Map();
    /** Returns a <li> element for use in the database display. */
    function getDisplayItem(key, val) {
        return $(`
          <li class='list-group-item'>
              <p>
              <span class="text-primary">${key}</span>: ${val}
              </p></li>`);
    }
    /** Recursively update the DOM by iterating through snapshot/children. */
    function recursiveDisplaySnapshot(snapshot, listNode) {
        if (snapshot.hasChildren()) {
            let newListNode = $(`
                <ul class="list-group">
                </ul>`);
            let listItem = $(`
              <li class='list-group-item'>
              <p>
              <span class="text-primary">${snapshot.key}</span>
              : 
              </p></li>`);
            listItem.append(newListNode);
            listNode.append(listItem);
            snapshot.forEach(function (childSnapshot) {
                recursiveDisplaySnapshot(childSnapshot, newListNode);
            });
        }
        else {
            listNode.append(getDisplayItem(snapshot.key, snapshot.val()));
            let wordsTokenized = snapshot.val().split(' ');
            wordsTokenized.forEach(function (word) {
                if (wordFreq.has(word)) {
                    // Increment word count by one.
                    wordFreq.set(word, wordFreq.get(word) + 1);
                }
                else {
                    wordFreq.set(word, 1);
                }
            });
        }
    }
    /** Attach an asynchronous listener to a database.Reference.
     * - The listener is triggered once for the initial state of the dat
     *   and again anytime the data changes.
     */
    function addListener(key) {
        let listener = database.ref(key);
        listener.on('value', function (snapshot) {
            console.log(`[value]: ${key} --> ${snapshot.val()}`);
        });
        return listener;
    }
    /** Remove the assigned listener for the given key. */
    function removeListener(key) {
        console.log('Removing listener for:', key);
        database.ref(key).off();
    }
    /** Helper function for extracting the most common word. */
    let getKeyByValue = (value) => {
        return Array.from(wordFreq.keys()).filter(key => wordFreq.get(key) === value)[0];
    };
    /**
     * Redraw the entire database tree when a value is added/changed/removed
     * from the database.
     */
    rootRef.on('value', function (rootSnapShot) {
        display.empty();
        wordFreq.clear();
        display.append(`
            <ul class='list-group'>
            </ul>`);
        rootSnapShot.forEach(function (childSnapshot) {
            recursiveDisplaySnapshot(childSnapshot, display.find('ul').first());
        });
        let maxWordCount = Math.max(...wordFreq.values());
        let mostCommonWord = getKeyByValue(maxWordCount);
        //let mostCommonWord = $.inArray(maxWordCount, Array.from(wordFreq.values()));
        $('#most-common-word').html(`
          <p>Most common word (value):
            "<strong class='text-success'>${mostCommonWord}</strong>"; Count:
            <strong class='text-success'>${maxWordCount}</strong>.
            </p>`);
    });
    /** Write a key-value pair to database. */
    function setCommand(key, value) {
        database.ref(ROOT_PATH + key).set(value);
        addListener(key);
    }
    /** Remove the given key and it's associated value from the database. */
    function deleteCommand(key) {
        database.ref(ROOT_PATH + key).remove();
        removeListener(key);
    }
    /* _____________ Form/Input Events ______________ */
    // Handle simple button events.
    submitBtn.on('click', function () {
        // Assign key -> value mapping in our database.
        if (validRef(keyInput.val()) == true) {
            setCommand(keyInput.val(), valInput.val());
        }
        else {
            console.log('INVALID REF. Ignoring.');
        }
    });
    $('#user-inputs').on('keyup', function (e) {
        if (e.which == ENTER_KEY) {
            submitBtn.click();
        }
    });
    deleteGroup.on('click', 'button', function (e) {
        let input = deleteGroup.find(':input');
        if (validRef(input.val()) == true) {
            deleteCommand(input.val());
        }
        else {
            console.log('INVALID REF. Ignoring.');
        }
    });
    deleteGroup.on('keyup', function (e) {
        if (e.which == ENTER_KEY) {
            deleteGroup.find('button').click();
        }
    });
});
//# sourceMappingURL=secret_page.js.map