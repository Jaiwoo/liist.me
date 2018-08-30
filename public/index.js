//
// ─── CLIENT JS ──────────────────────────────────────────────────────────────────
//

// jQuery selectors

const getLiistsBtn = $('#get-liists-btn');
const liistsTableBody = $('#liists-table-body');
const liistTableBody = $('#liist-table-body');
const liistName = $('#liist-name');
const liistDescription = $('#liist-description');
const liistOwner = $('#liist-owner');

//
// ─── RECENT LIISTS CONTROLS ─────────────────────────────────────────────────────
//

function getRecentLiists (callback) {
  setTimeout(function(){ callback(mockDatabase);}, 100);
}

function displayLiists (data) {
  for (let index in data.liists) {
    liistsTableBody.append(
      `<tr id="${data.liists[index].id}">
        <td>${data.liists[index].name}</td>
        <td>${data.liists[index].owner}</td>
        <td>${data.liists[index].length}</td>
        <td>x/x/xx</td>
      </tr>`
    );
  }
  // add row click handlers
  $('#liists-table tr').click(function() {
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

function getLiistByID (ID, callback) {
  const liist = mockDatabase.liists.find(function(element) {
    return element.id == ID;
  });
  callback(liist);
}

function displayLiist (liist) {
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
// ─── START APP LOGIC ────────────────────────────────────────────────────────────
//

getLiistsBtn.on('click', function() {
  getAndDisplayRecentLiists();
});
