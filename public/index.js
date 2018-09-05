//
// ─── JQUERY SELECTORS─────────────────────────────────────────────────────────────
//

//TABLE ELEMENTS
const liistsTableBody = $('#liists-table-body');
const liistTableBody = $('#liist-table-body');
const liistName = $('#liist-name');
const liistDescription = $('#liist-description');
const liistOwner = $('#liist-owner');

// BUTTONS
const getLiistsBtn = $('#get-liists-btn');
const homeButton = $('#banner-text');
const addSongButton = $('#add-song-btn');
const createLiistButton = $('#create-btn');

// PAGES
const landingPage = $('#landing-container');
const liistsPage = $('#liists-container');
const liistPage = $('#liist-container');
const createLiistPage = $('#create-liist-container');
const addSongPage = $('#add-song-container');

//
// ─── API CALLS ──────────────────────────────────────────────────────────────────
//

function getRecentLiists (callback) {
  setTimeout(function(){ callback(mockDatabase);}, 100);
}


function getLiistByID (ID, callback) {
  const liist = mockDatabase.liists.find(function(element) {
    return element.id == ID;
  });
  callback(liist);
}


//
// ─── RECENT LIISTS CONTROLS ─────────────────────────────────────────────────────
//

function displayLiists (data) {
  for (let index in data.liists) {
    liistsTableBody.append(
      `<tr id="${data.liists[index].id}" class="liist-table-row">
        <td>${data.liists[index].name}</td>
        <td>${data.liists[index].owner}</td>
        <td>${data.liists[index].length}</td>
        <td>x/x/xx</td>
      </tr>`
    );
  }
  // add row click handlers
  $('#liists-table .liist-table-row').click(function() {
    liistsPage.hide();
    liistsTableBody.empty();
    liistPage.show();
    clearLiistTable();
    getAndDisplayLiist($(this).attr('id'));
  });
}

function getAndDisplayRecentLiists () {
  getRecentLiists(displayLiists);
}

//
// ─── LIIST CONTROLS ─────────────────────────────────────────────────────────────
//

function displayLiist (liist) {
  // add song button handler
  addSongButton.on('click', function() {
    $('#add-song-liistName').text(`${liist.name}`);
    liistPage.hide();
    addSongPage.show();
  });

  liistName.text(`${liist.name}`);
  liistOwner.text(`By: ${liist.owner}`);
  liistDescription.text(`${liist.description}`);
  for (let index in liist.songs) {
    liistTableBody.append(
      `<tr class="liist-table-row">
        <td>${liist.songs[index].title}</td>
        <td>${liist.songs[index].artist}</td>
        <td>${liist.songs[index].addedBy}</td>
        <td>${liist.songs[index].stars}</td>`
    );
  }
}

function getAndDisplayLiist (ID) {
  getLiistByID(ID, displayLiist);
}

function clearLiistTable () {
  liistName.empty();
  liistOwner.empty();
  liistDescription.empty();
  liistTableBody.empty();
}



//
// ─── BUTTON HANDLERS─────────────────────────────────────────────────────────────
//

getLiistsBtn.on('click', function() {
  liistsTableBody.empty();
  getAndDisplayRecentLiists();
  createLiistButton.show();
  landingPage.hide();
  liistPage.hide();
  createLiistPage.hide();
  addSongPage.hide();
  liistsPage.show();
});

createLiistButton.on('click', function() {
  landingPage.hide();
  createLiistButton.hide();
  liistPage.hide();
  liistsPage.hide();
  addSongPage.hide();
  createLiistPage.show();

});

homeButton.on('click', function() {
  liistsPage.hide();
  liistsTableBody.empty();
  liistPage.hide();
  clearLiistTable();
  landingPage.show();
});
