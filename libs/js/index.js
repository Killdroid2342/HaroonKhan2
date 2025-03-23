let personnelFetched = false;
let departmentsFetched = false;
let locationsFetched = false;

$(window).on('load', function () {
  if ($('#preloader').length) {
    $('#preloader')
      .delay(1000)
      .fadeOut('slow', function () {
        $(this).remove();
      });
  }
});
$('#departmentsBtn').click(function () {
  if (!departmentsFetched) {
    getDepartments();
    departmentsFetched = true;
  }
});
$('#locationsBtn').click(function () {
  if (!locationsFetched) {
    getLocations();
    locationsFetched = true;
  }
});
getAll();

function showConfirm() {
  $('.warning-confirm').css({ display: 'block' });
}

function getDepartments() {
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllDepartments.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result, 'getDepartments');
      var departments = result['data'];
      var departmentSelect = $('._departments');
      departmentSelect.empty();

      var data = result['data'];

      $('<option>', {
        text: 'Select from Department',
        value: 'all',
        id: 'placeholderDepartment',
        disabled: true,
        selected: true,
      }).appendTo(departmentSelect);

      $('<option>', {
        text: 'All Departments',
        value: 'all',
      }).appendTo('#departments');

      departments.forEach(function (department) {
        $('<option>', {
          text: department.name,
          value: department.id,
        }).appendTo(departmentSelect);
      });

      populateDepartmentTable();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function getLocations() {
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllLocations.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result, 'getLocations');
      var locations = result['data'];
      var locationSelect = $('._locations');
      locationSelect.empty();

      var data = result['data'];

      $('<option>', {
        text: 'Select a Location',
        value: 'all',
        id: 'placeholderLocation',
        disabled: true,
        selected: true,
      }).appendTo(locationSelect);

      $('<option>', {
        text: 'All Locations',
        value: 'all',
      }).appendTo('#locations');

      locations.forEach(function (location) {
        $('<option>', {
          text: location.name,
          value: location.id,
        }).appendTo(locationSelect);
      });

      populateLocationTable(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function resetAll() {
  getAll();
  getLocations();
  getDepartments();
  $('#any').prop('checked', true);
}

$('#myTab').on('shown.bs.tab', function (e) {
  $('#searchInp').val('');
  getAll();
  getLocations();
  getDepartments();
});

function searchPersonnel() {
  var searchQuery = $('#searchInp').val().toLowerCase();

  var activeTab = $('#myTab .nav-link.active').attr('id');

  if (activeTab === 'personnelBtn') {
    searchPersonnelTab(searchQuery);
  } else if (activeTab === 'departmentsBtn') {
    searchDepartmentsTab(searchQuery);
  } else if (activeTab === 'locationsBtn') {
    searchLocationsTab(searchQuery);
  }
}

function searchPersonnelTab(searchQuery) {
  $('#personnelTableBody tr').each(function () {
    var fullName = $(this).find('td').first().text().toLowerCase();
    var jobTitle = $(this).find('td').eq(1).text().toLowerCase();
    var location = $(this).find('td').eq(2).text().toLowerCase();
    var email = $(this).find('td').eq(3).text().toLowerCase();

    if (
      fullName.indexOf(searchQuery) !== -1 ||
      jobTitle.indexOf(searchQuery) !== -1 ||
      location.indexOf(searchQuery) !== -1 ||
      email.indexOf(searchQuery) !== -1
    ) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function searchDepartmentsTab(searchQuery) {
  searchQuery = searchQuery.toLowerCase();

  $('#departmentTableBody tr').each(function () {
    var departmentName = $(this).find('td').first().text().toLowerCase();
    var location = $(this).find('td').eq(1).text().toLowerCase();

    if (
      departmentName.indexOf(searchQuery) !== -1 ||
      location.indexOf(searchQuery) !== -1
    ) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function searchLocationsTab(searchQuery) {
  $('#locationTableBody tr').each(function () {
    var locationName = $(this).find('td').first().text().toLowerCase();

    if (locationName.indexOf(searchQuery) !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

$('#searchInp').on('input', function () {
  searchPersonnel();
});

function populatePersonnelTable() {
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllPersonnel.php',
    dataType: 'json',
    success: function (result) {
      console.log(result, 'populatePersonnelTable');

      var directoryBody = $('#personnelTableBody');
      directoryBody.empty();

      var directoryResult = result['data'];

      directoryResult.forEach(function (entry) {
        var row = $('<tr></tr>').addClass('content').appendTo(directoryBody);

        var lastName = entry.lastName;
        var fullName = lastName.toUpperCase() + ', ' + entry.firstName;
        $('<td></td>').text(fullName).appendTo(row);

        $('<td></td>')
          .text(entry.jobTitle || 'N/A')
          .addClass('d-none d-md-table-cell')
          .appendTo(row);

        $('<td></td>')
          .text(entry.location)
          .addClass('d-none d-md-table-cell')
          .appendTo(row);

        $('<td></td>')
          .text(entry.email)
          .addClass('d-none d-md-table-cell')
          .appendTo(row);

        var actionTD = $('<td></td>').addClass('text-end').appendTo(row);

        $('<button></button>')
          .attr('id', 'edit' + entry.id)
          .addClass('btn btn-primary btn-sm')
          .html('<i class="fa-solid fa-pencil fa-fw"></i>')
          .appendTo(actionTD)
          .click(function () {
            console.log('Editing personnel:', entry);

            $('#editPersonnelModal').modal('show');

            $('#editPersonnelEmployeeID').val(entry.id);
            $('#editPersonnelFirstName').val(entry.firstName);
            $('#editPersonnelLastName').val(entry.lastName);
            $('#editPersonnelJobTitle').val(entry.jobTitle);
            $('#editPersonnelEmailAddress').val(entry.email);

            $('#editPersonnelForm').submit(function (event) {
              event.preventDefault();

              let personnelID = $('#editPersonnelEmployeeID').val();
              let firstName = $('#editPersonnelFirstName').val();
              let lastName = $('#editPersonnelLastName').val();
              let jobTitle = $('#editPersonnelJobTitle').val();
              let email = $('#editPersonnelEmailAddress').val();

              $.ajax({
                type: 'POST',
                url: 'libs/php/updatePersonnelByID.php',
                data: {
                  personnelID: personnelID,
                  firstName: firstName,
                  lastName: lastName,
                  jobTitle: jobTitle,
                  email: email,
                },
                dataType: 'json',
                success: function (response) {
                  if (response.status.code === '200') {
                    console.log('✅ Personnel updated successfully!');
                    $('#editPersonnelModal').modal('hide');
                    populatePersonnelTable();
                  } else {
                    console.log('❌ Failed to update personnel');
                  }
                },
                error: function () {
                  console.log('Error during personnel update');
                },
              });
            });
          });

        $('<button></button>')
          .attr('id', 'delete' + entry.id)
          .addClass('btn btn-danger btn-sm')
          .html('<i class="fa-solid fa-trash fa-fw"></i>')
          .appendTo(actionTD)
          .click(function () {
            $('#deletePersonnelModal').modal('show');

            $('#deleteEmployeeBtn').data('personnelId', entry.id);
            $('#deleteFirstName').text(entry.firstName);
            $('#deleteLastName').text(entry.lastName);
            $('#deleteEmail').text(entry.email);
            $('#deleteDepartmentID').text(entry.department);

            $('#deleteEmployeeBtn').on('click', function () {
              var personnelId = $(this).data('personnelId');
              $.ajax({
                type: 'POST',
                url: 'libs/php/deletePersonnelByID.php',
                data: { personnelID: personnelId },
                success: function (response) {
                  console.log('✅ Personnel ' + personnelId + ' deleted');
                  $('#deletePersonnelModal').modal('hide');
                  $('#delete' + personnelId)
                    .closest('tr')
                    .remove();
                },
                error: function () {
                  alert('There was an error processing your request.');
                },
              });
            });
          });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('AJAX error:', jqXHR, textStatus, errorThrown);
    },
  });
}

function populateDepartmentTable() {
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllDepartments.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result, 'populateDepartmentTable');

      var directoryBody = $('#departmentTableBody');
      directoryBody.empty();

      var directoryResult = result['data'];

      directoryResult.forEach(function (entry) {
        var row = $('<tr></tr>').addClass('content').appendTo(directoryBody);

        $('<td></td>').text(entry.name).appendTo(row);

        $('<td></td>')
          .text(entry.location)
          .addClass('d-none d-md-table-cell')
          .appendTo(row);

        var actionTD = $('<td></td>').addClass('text-end').appendTo(row);

        $('<button></button>')
          .attr('id', 'editDept' + entry.id)
          .addClass('btn btn-primary btn-sm')
          .html('<i class="fa-solid fa-pencil fa-fw"></i>')
          .appendTo(actionTD)
          .click(function () {
            console.log('Editing department:', entry);

            $('#editDepartmentModal').modal('show');

            $('#editDepartmentID').val(entry.id);
            $('#editDepartmentName').val(entry.name);
            console.log(entry);
            $('#editDepartmentForm').submit(function (event) {
              event.preventDefault();

              let departmentID = $('#editDepartmentID').val();
              let departmentName = $('#editDepartmentName').val();
              let location = $('#editLocationName').val();
              let editLocationID = entry.locationID;
              console.log('Sending Data:', {
                departmentID,
                departmentName,
                location,
                editLocationID,
              });

              $.ajax({
                type: 'POST',
                url: 'libs/php/updateDepartmentByID.php',
                data: {
                  departmentID: departmentID,
                  name: departmentName,
                  location: location,
                },
                dataType: 'json',
                success: function (response) {
                  console.log('Server Response:', response);

                  if (response.status.code === '200') {
                    console.log('✅ Department updated successfully!');
                    $('#editDepartmentModal').modal('hide');
                    populateDepartmentTable();
                  } else {
                    console.log(
                      '❌ Failed to update department:',
                      response.status.description
                    );
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log('AJAX error:', textStatus, errorThrown);
                },
              });
            });
          });

        $('<button></button>')
          .attr('id', 'deleteDept' + entry.id)
          .addClass('btn btn-danger btn-sm deleteDepartmentBtn')
          .html('<i class="fa-solid fa-trash fa-fw"></i>')
          .appendTo(actionTD);

        $('#deleteDept' + entry.id).click(function () {
          $('#deleteDepartmentName').text(entry.name);

          $('#deleteDepartmentByID').val(entry.id);
          $('#deleteDepartmentBtn').on('click', function () {
            console.log('111');

            var departmentId = entry.id;
            console.log(departmentId, 'this is the department ID to delete');

            if (departmentId) {
              $.ajax({
                type: 'POST',
                url: 'libs/php/deleteDepartmentByID.php',
                data: { departmentID: departmentId },
                success: function (response) {
                  console.log(
                    response,
                    'this is response from deleteDepartmentByID.php'
                  );

                  $('#deleteDept' + departmentId)
                    .closest('tr')
                    .remove();
                  $('#deleteDepartmentModal').modal('hide');
                },
                error: function () {
                  alert('There was an error processing your request.');
                },
              });
            } else {
              console.log('No department ID found');
            }
          });

          console.log('Department ID to delete: ', entry.id);

          $('#deleteDepartmentModal').modal('show');
        });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function populateLocationTable() {
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAlllocations.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result);
      console.log(result.data, 'populate location');

      var directoryBody = $('#locationTableBody');
      directoryBody.empty();

      result.data.forEach(function (entry) {
        console.log(entry.name, 'this is entry');
        var row = $('<tr></tr>').addClass('content').appendTo(directoryBody);

        $('<td></td>').text(entry.name).appendTo(row);

        var actionTD = $('<td></td>').addClass('text-end').appendTo(row);

        $('<button></button>')
          .attr('id', 'editLoc' + entry.id)
          .addClass('btn btn-primary btn-sm')
          .html('<i class="fa-solid fa-pencil fa-fw"></i>')
          .appendTo(actionTD)
          .click(function () {
            console.log(entry, 'clicked entry');

            $('#editLocationModal').modal('show');

            $('#editLocationID').val(entry.id);
            $('#editLocationNameModal').val(entry.name);
            console.log(entry);

            $('#editLocationForm')
              .off('submit')
              .on('submit', function (event) {
                event.preventDefault();

                let locationID = $('#editLocationID').val();
                let locationName = $('#editLocationNewName').val();

                console.log('Sending Data:', { locationID, locationName });

                $.ajax({
                  type: 'POST',
                  url: 'libs/php/updateLocationByID.php',
                  data: { locationID: locationID, locationName: locationName },
                  dataType: 'json',
                  success: function (response) {
                    console.log('Server Response:', response);

                    if (response.status.code === '200') {
                      console.log('✅ Location updated successfully!');
                      $('#editLocationModal').modal('hide');
                      populateLocationTable();
                    } else {
                      console.log(
                        '❌ Failed to update location:',
                        response.status.description
                      );
                    }
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    console.log('AJAX error:', textStatus, errorThrown);
                  },
                });
              });
            $('#editLocationNewName').val('');
          });

        $('<button></button>')
          .attr('id', 'deleteLoc' + entry.id)
          .addClass('btn btn-danger btn-sm')
          .html('<i class="fa-solid fa-trash fa-fw"></i>')
          .appendTo(actionTD)
          .click(function () {
            $('#deleteLocationName').text(entry.name);
            $('#deleteLocationByID').val(entry.id);

            console.log('Location ID to delete: ', entry.id);

            $('#deleteLocationModal').modal('show');
            $('#deleteLocationBtn')
              .off('click')
              .on('click', function () {
                var locationId = entry.id;
                console.log(locationId, 'this is the location ID to delete');

                if (locationId) {
                  $.ajax({
                    type: 'POST',
                    url: 'libs/php/deleteLocationByID.php',
                    data: { locationID: locationId },
                    dataType: 'json',
                    success: function (response) {
                      console.log(
                        response,
                        'Response from deleteLocationByID.php'
                      );

                      if (response.status.code === '200') {
                        $('#deleteLoc' + locationId)
                          .closest('tr')
                          .remove();

                        $('#deleteLocationModal').modal('hide');

                        alert('Location deleted successfully.');
                      } else {
                        alert('Error: ' + response.status.description);
                      }
                    },
                    error: function () {
                      alert('There was an error processing your request.');
                    },
                  });
                } else {
                  console.log('No location ID found');
                }
              });
          });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function getAll() {
  $('#departments').prop('selectedIndex', 0);
  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllPersonnel.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result, 'getAll');
      var data = result['data'];
      populatePersonnelTable(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

$('#refreshBtn').click(function () {
  personnelFetched = false;
  departmentsFetched = false;
  locationsFetched = false;
  resetAll();
  console.log('Refreshed');
});

document.querySelectorAll('.deleteDepartmentBtn').forEach((button) => {
  button.addEventListener('click', function () {
    let addModal = new bootstrap.Modal(
      document.getElementById('addPersonnelModal')
    );
    addModal.show();
  });
});

let personnelData = [];
console.log(personnelData, 'personnelData');
document.getElementById('filterBtn').addEventListener('click', function () {
  let filterModal = new bootstrap.Modal(
    document.getElementById('filterPersonnelModal')
  );
  filterModal.show();

  $.ajax({
    type: 'GET',
    url: 'libs/php/getAllData.php',
    dataType: 'json',
    data: {},
    success: function (result) {
      console.log(result, 'getAll');
      personnelData = result['data'];

      const departments = [
        ...new Set(personnelData.map((person) => person.department_name)),
      ];

      const departmentDropdown = document.getElementById(
        'filterPersonnelDepartment'
      );

      departmentDropdown.innerHTML = `<option value="">All Departments</option>`;

      departments.forEach((department) => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentDropdown.appendChild(option);
      });

      const locations = [
        ...new Set(personnelData.map((person) => person.location_name)),
      ];

      const locationDropdown = document.getElementById(
        'filterPersonnelLocation'
      );

      locationDropdown.innerHTML = `<option value="">All Locations</option>`;

      locations.forEach((location) => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationDropdown.appendChild(option);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
});

function applyFilter() {
  const selectedDepartment = document.getElementById(
    'filterPersonnelDepartment'
  ).value;
  const selectedLocation = document.getElementById(
    'filterPersonnelLocation'
  ).value;

  const filteredResults = personnelData.filter((person) => {
    const departmentMatch = selectedDepartment
      ? person.department_name === selectedDepartment
      : true;
    const locationMatch = selectedLocation
      ? person.location_name === selectedLocation
      : true;
    return departmentMatch && locationMatch;
  });

  populateFilterResultsTable(filteredResults);
}

function populateFilterResultsTable(filteredResults) {
  const tableBody = document.getElementById('filterResultsTableBody');
  tableBody.innerHTML = '';

  filteredResults.forEach((result) => {
    let row = `<tr>
          <td>${result.personnel_name}</td>
          <td>${result.location_name}</td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

document
  .querySelector('button[form="filterPersonnelForm"]')
  .addEventListener('click', function (event) {
    event.preventDefault();

    var filterModalElement = document.getElementById('filterPersonnelModal');
    var filterModal = bootstrap.Modal.getInstance(filterModalElement);

    if (filterModal) {
      filterModal.hide();
    }

    applyFilter();

    var filterResultsModal = new bootstrap.Modal(
      document.getElementById('filterResultsModal')
    );
    filterResultsModal.show();
  });
$(document).ready(function () {
  $('#addBtn').click(function () {
    $('#addEntryModal').modal('show');
  });
});
$('#addEntryForm').submit(function (event) {
  event.preventDefault();

  let formData = {
    departmentName: $('#personnelDepartment').val(),
    locationName: $('#personnelLocation').val(),
    firstName: $('#personnelFirstName').val(),
    lastName: $('#personnelLastName').val(),
    jobTitle: $('#personnelJobTitle').val(),
    email: $('#personnelEmail').val(),
  };

  $.ajax({
    url: 'libs/php/addNewEntry.php',
    type: 'POST',
    data: formData,
    dataType: 'json',
    success: function (response) {
      console.log(response);
      if (response.status.code === '200') {
        $('#addEntryModal').modal('hide');
        $('#addEntryForm')[0].reset();
        getAll();
        getLocations();
        getDepartments();
      } else {
        console.log('Error: ' + response.status.description);
      }
    },
    error: function () {
      console.log('An error occurred while inserting data.');
    },
  });
});
