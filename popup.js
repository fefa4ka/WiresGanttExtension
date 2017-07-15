        $(function() {
           chrome.storage.sync.get('token', function(keys) {
                if(keys.token != '') {
                    displaySuccess();
                } else {
                    displayForm();
                }
            });
        });

        function displaySuccess() {
            $('.authorization input').attr('disabled','disabled').attr('type', 'password').val('ebala');
            $('.authorization button')
                .text('Change')
                .addClass('btn-warning').removeClass('btn-primary')
                .unbind('click')
                .click(function () {
                    displayForm();
                });
            $('.authorization h5').text('Github Authorization Success');
        }

        function displayForm() {
            chrome.storage.sync.set({'token': ''}, function() {
                $('.authorization input').removeAttr('disabled').attr('type', 'text').val('');;
                $('.authorization button')
                    .text('Use')
                    .removeClass('btn-warning').addClass('btn-primary')
                    .unbind('click')
                    .click(function () {
                        saveChanges();
                    });
                $('.authorization h5').text('Github Authorization Success');
            });
        }

        function saveChanges() {
            // Get a value saved in a form.
            var token = $('#token').val();

            // Check that there's some code there.
            if (!token) {
              return;
            }
            // Save it using the Chrome extension storage API.
            chrome.storage.sync.set({'token': token}, function() {
                displaySuccess();
            });
          }