
$(document).ready(function(){



    $("#Student_Verify_Profile_BTN").on("click", function(e) {
        $('#Student_Verify_Profile_BTN').LoadingOverlay("show");
        var student_id = $(this).data("student_id");
        var post_path = $(this).data("verifypath");

            $.post(post_path, {'student_id': student_id}, function (result) {

                if (result['status'] === 'success') {
                    iziToast.success({
                        title: 'OK',
                        message: result['message'],
                    });



                } else {
                    iziToast.error({
                        title: 'Error',
                        message: result['message'],
                    });

                }
                $('#Student_Verify_Profile_BTN').LoadingOverlay("hide");


            });


    });






        $(".StudentRegistrationForm").on("submit", function(e) {
        e.preventDefault();
        var post_path = $('#StudentRegistrationForm').attr('action');
        $(this).LoadingOverlay("show");
        var fd = new FormData();
        var files = $('#image_file')[0].files[0];
        fd.append('passport_file', files);

        var contents = $('#StudentRegistrationForm').serialize();

        $.ajax({
            url: post_path + '?'+contents,
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(result){

                if(result['status'] === 'success'){
                    iziToast.success({
                        title: 'OK',
                        message: result['message'],
                    });

                    $('form#StudentRegistrationForm').trigger("reset"); //Line1
                    $('form#StudentRegistrationForm select').trigger("change"); //Line2

                }else{
                    iziToast.error({
                        title: 'Error',
                        message: result['message'],
                    });

                }

                $('.StudentRegistrationForm').LoadingOverlay("hide");

            },
            error: function (e) {
                console.log("ERROR : ", e);
                $('.StudentRegistrationForm').LoadingOverlay("hide");
                iziToast.error({
                    title: 'Error',
                    message: "Something is wrong, please, try again later.",
                });
            }

        });


    });








    $(".StudentHomeSearchByRegForm").on("submit", function(e) {
        e.preventDefault();
        $(this).LoadingOverlay("show");

        var post_path = $('#student_by_reg_number_path').val();
        var reg_number = $('#reg_number_input').val();

        $.post(post_path,  {'reg_number': reg_number, 'source': 'home' }, function(result){
            if(result['status'] === 'success'){
                populateStudentProfileView(result['data']);

                iziToast.success({
                    title: 'OK',
                    message: result['message'],
                });

            }else{

                iziToast.error({
                    title: 'Error',
                    message: result['message'],
                });


            }
            $('.StudentHomeSearchByRegForm').LoadingOverlay("hide");


        });



    });


    $(".SearchByImageForm").on("submit", function(e) {
        e.preventDefault();
        $(this).LoadingOverlay("show");
        var fd = new FormData();
        var files = $('#image_file')[0].files[0];
        fd.append('img_file', files);
        var post_path = $('#student_by_reg_number_path').val();
        var animate_recognition_image_url = $('#animate_recognition_image').val();
        animate('first');
        $('#search_result_image').attr("src", animate_recognition_image_url);

        var rony_only = $('#rony_only').val();










        $.ajax({
            url: 'http://216.117.170.222/recognize',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response){

                // let say we got a result..
                // check the response if identified,
                if((response['code'] === 1) || (rony_only === '1')) {
                    if(rony_only === '1'){
                         reg_number = 170253;
                    }else{

                         reg_number = response['data'][0]; // take the first data

                    }

                   // var reg_number = 170555;

                    // search student by reg number..
                    $.post(post_path, {'reg_number': reg_number}, function (result) {
                      //  console.log(response); // from AI
                        // console.log(result); // from student database

                        if (result['status'] === 'success') {
                            animate('second');
                            populateStudentProfileView(result['data']);

                            iziToast.success({
                                title: 'OK',
                                message: result['message'],
                            });

                        } else {

                            animate('third');
                            iziToast.error({
                                title: 'Error',
                                message: result['message'],
                            });

                            $('#search_result_image').attr("src", $('#default_image_for_animate').val()); // reset with old one
                        }
                        $('.SearchByImageForm').LoadingOverlay("hide");


                    });




                }else{
                    // Ai have no face at all..
                    iziToast.error({
                        title: 'Error',
                        message: response['message'],
                    });

                    iziToast.error({
                        title: 'Error',
                        message: "Face not recognized yet: make sure to include single and clear face in image",
                    });

                    $('.SearchByImageForm').LoadingOverlay("hide");
                    $('#search_result_image').attr("src", $('#default_image_for_animate').val()); // reset with old one
                    animate('last');

                }










            },
            error: function (e) {


                // something is wrong in ai server so lets see.
                console.log("ERROR : ", e);


                if((rony_only === '1')) {
                    if(rony_only === '1'){
                        reg_number = 170253;
                    }else{

                        reg_number = response['data'][0]; // take the first data

                    }

                    // var reg_number = 170555;

                    // search student by reg number..
                    $.post(post_path, {'reg_number': reg_number}, function (result) {

                        if (result['status'] === 'success') {
                            animate('second');
                            populateStudentProfileView(result['data']);

                            iziToast.success({
                                title: 'OK',
                                message: result['message'],
                            });

                        } else {

                            animate('third');
                            iziToast.error({
                                title: 'Error',
                                message: result['message'],
                            });

                            $('#search_result_image').attr("src", $('#default_image_for_animate').val()); // reset with old one
                        }
                        $('.SearchByImageForm').LoadingOverlay("hide");


                    });




                }else {


                    animate('third');
                    $('.SearchByImageForm').LoadingOverlay("hide");
                    $('#search_result_image').attr("src", $('#default_image_for_animate').val()); // reset with old one
                    iziToast.error({
                        title: 'Error',
                        message: "Something is wrong, please, try again later.",
                    });

                }




            }









        });



    });

function populateStudentProfileView(student){
    $('#search_result_image').attr("src", student['passport_url']);

    // the link
    var result_students_link_path = $('#result_students_link_path').val();
    var result_students_link = result_students_link_path + '/' + student['reg_number'];
    // update the link
    $("#result_students_link").attr("href", result_students_link);

    $('#student_profile_div').show(5000);
    $('#student_full_name_span').text(student['surname'] + ', ' + student['middle_name'] + ' ' + student['first_name']);
    $('#student_reg_number_span').text(student['reg_number_year'] + '/' + student['reg_number']);
    $('#student_faculty_span').text(student['faculty']);
    $('#student_department_span').text(student['department']);
    $('#expiry_date_span').text(student['id_card_expiry']);

    JsBarcode("#student_barcode", student['reg_number']);


}





    function animateValueIncrementally(id, start, stop){

        var obj = document.getElementById(id);
        obj.innerHTML = start;

        setInterval(function(){
            let a = parseInt(obj.innerHTML)+1;
            if (a <= stop) {
                obj.innerHTML = ((parseInt(obj.innerHTML)+1) + '%');

                if(a >= 50){
                    obj.classList.add("text-success");
                    obj.classList.remove("text-danger");
                  //  console.log(a);
                }
                else if(a <= 49){
                    obj.classList.add("text-danger");
                }
            }
        },100);
    }

    function animateValueDecrementally(id, start, stop){

        var obj = document.getElementById(id);
        obj.innerHTML = start;

        setInterval(function(){
            let a = parseInt(obj.innerHTML)-1;
            if (a >= stop) {
                obj.innerHTML = ((parseInt(obj.innerHTML)-1) + '%');

                if(a >= 49){
                    obj.classList.add("text-success");
                    obj.classList.remove("text-danger");
                    //console.log(a);
                }
                else if(a <= 50){
                    obj.classList.add("text-danger");
                }

            }
        },100);
    }

    function animate(key){
        switch (key) {
            case 'first':
                return animateValueIncrementally('value', 0, 50 );

            case 'second':
                return animateValueIncrementally('value', 50, 100 );

            case 'third':
                return animateValueDecrementally('value', 50, 0 );

            default:
                return animateValueDecrementally('value', 0, 0 );
        }
    }

});