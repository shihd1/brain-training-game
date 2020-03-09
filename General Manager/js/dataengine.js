class DataEngine {

    constructor(data_id) {


        if (data_id == undefined || data_id == null || data_id == '') {
            // default data_id
            this.data_id = 'DE_' + new Date().format("yyyy-MM-dd");
        } else {
            this.data_id = data_id;
        }

        // retrieve data from localstorage
        this.db =  localStorage.getItem(this.data_id);
        if (this.db == null) {
            this.db = {};
        }else{
            this.db = JSON.parse(this.db);
        }

        // db field_name
        this.FN_ADMIN = 'admin' ;
        this.FN_TOTAL_LV = 'total-level';
        this.FN_P_COUNT = 'play-count';
        this.FN_RECORD = 'record';
        this.FN_DATETIME = 'datetime';
        this.FN_SCORE = 'score';
    }

    ///////////////////////////
    // admin-user related
    ///////////////////////////

    create_admin_password(pwd) {
        if (this.db[ this.FN_ADMIN ] != null) {
            console.log('admin had existed !!');
            return false;
        } else {            
            this.db[this.FN_ADMIN ] = btoa(pwd);
            console.log('set admin pwd: successed!!');
            return true;
        }
    }

    check_admin_is_valid(pwd) {
        if (this.db[this.FN_ADMIN] != null) {
            if (this.db[this.FN_ADMIN] === btoa(pwd)) {
                return true;
            }
        }
        return false;
    }

    force_reset_admin_password(pwd) {
        var ikey = window.prompt( "⚠️ 注意：重設密碼，所有資料都將清除！！如果要繼續，請輸入「好的」") ;       
        if( ikey==='好的'){
            this.db = {};
            this.db[this.FN_ADMIN ] = btoa(pwd);
            console.log('set admin pwd: successed!!');
            return true;
        }
        return false ;
        
    }



    ///////////////////////////
    // user related
    ///////////////////////////

    create_user_password(uid, pwd) {
        if (this.db[uid] != null) {
            console.log('user-id had existed !! :' + uid);
            return false;
        } else {
            this.db[uid] = {};
            this.db[uid]['pwd'] = btoa(pwd);
            console.log('create user : successed!! : ' + uid);
            return true;
        }
    }

    check_user_is_valid(uid, pwd) {
        if (this.db[uid] != null) {
            if (this.db[uid].pwd === btoa(pwd)) {
                return true;
            }
        }
        return false;
    }

    reset_usr_password(uid, old_pwd, new_pwd) {

        if (this.check_user_is_valid(uid, old_pwd)) {
            this.db[uid]['pwd'] = btoa(new_pwd);
            console.log('reset password : successed!!');
            return true;
        }
        return false;
    }

    get_user_ids() {
        let arr = [];
        for (let p in this.db) {
            arr.push(p);
        }
        return arr;
    }

    ///////////////////////////
    // game record
    ///////////////////////////    
    create_game(uid, game_name, max_level) {
        if (this.db[uid] != null) {
            if (this.db[uid][game_name] != null) {
                return false;
            }
            this.db[uid][game_name] = {};
            this.db[uid][game_name][this.FN_TOTAL_LV] = max_level;
            this.db[uid][game_name][this.FN_P_COUNT] = [];
            this.db[uid][game_name][this.FN_RECORD] = [];
            this.db[uid][game_name][this.FN_RECORD][0] = this.generate_a_record(max_level);
            for (let i = 0; i < max_level; i++) {
                this.db[uid][game_name][this.FN_P_COUNT][i] = 0;
            }
            return true;
        } else {
            console.log("the user doesn't exist!! : " + uid);
            return false;
        }
    }

    generate_a_record(length) {
        let r = {};
        r[this.FN_DATETIME] = new Date().format("yyyy-MM-dd hh:mm:ss");
        r[this.FN_SCORE] = [];
        for (let i = 0; i < length; i++) {
            r[this.FN_SCORE][i] = 0;
        }
        return r;
    }

    add_game_record(uid, game_name, level_index_fr_0, score) {
        if (this.db[uid] != null) {
            if (this.db[uid][game_name] == undefined) {
                console.log("the game doesn't exist !! :" + game_name);
                console.log('please use [create_game] to create game initial data first!!');
                return false;
            }
            if (this.db[uid][game_name][this.FN_TOTAL_LV] <= level_index_fr_0) {
                console.log('[level_index_fr_0] out of bounds , it should be less than "' + this.db[uid][game_name][this.FN_TOTAL_LV] + '"');
                console.log('[level_index_fr_0] : ' + level_index_fr_0);
                return false;
            }
            this.db[uid][game_name][this.FN_P_COUNT][level_index_fr_0]++;
            let record_data = this.db[uid][game_name][this.FN_RECORD];
            // retrive last record
            let last_record = record_data[record_data.length - 1];
            // new record
            let my_record = this.generate_a_record(this.db[uid][game_name][this.FN_TOTAL_LV]);
            for (let i = 0; i < last_record[this.FN_SCORE].length; i++) {
                if (i === level_index_fr_0) {
                    my_record[this.FN_SCORE][i] = score;
                } else {
                    my_record[this.FN_SCORE][i] = last_record[this.FN_SCORE][i];
                }
            }
            record_data.push(my_record);
            return true;

        } else {
            console.log("the user doesn't exist!! : " + uid);
            return false;
        }

    }

    ///////////////////////////
    // IO related
    ///////////////////////////


    save_to_localstorage() {
        if (this.get_user_ids().length < 1) {
            console.log('database is empty !!');
            return false;
        }
        let datastring = JSON.stringify(this.db);
        localStorage.setItem(this.data_id, datastring);
    }
    export_to_json_file() {

        let dataStr = JSON.stringify(this.db);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = this.data_id + '.json';
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    import_data_from_json_file(file_path) {

        //fetch('abc.json')
        fetch(file_path)
            .then(r => r.text())
            .then(t => {
                // console.log('===============');
                // console.log(t);
                // console.log('===============');
                this.db = JSON.parse( t ) ;
                console.log('load data from file : '+file_path) ;
            });
    }

}

///////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////

function my_alert(text) {
    swal({
      title: "",
      text: text,
      type: "error",
      showCancelButton: false,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "確認",
      closeOnConfirm: false
    });
  }
  function my_info(text) {
    swal({
      title: "",
      text: text,
      type: "info",
      showCancelButton: false,
      confirmButtonClass: "btn-info",
      confirmButtonText: "確認",
      closeOnConfirm: false
    });
  }

  
  function my_info_redirect( info_text , target_page , sec){
    swal({
        title: "",
        text: info_text,
        type: "info",
        showCancelButton: false,
        closeOnConfirm: false,
        confirmButtonClass: "btn-info",
      confirmButtonText: "確認",
        showLoaderOnConfirm: true
      }, function () {
        setTimeout(function () {
          location = target_page;
        }, sec*1000);
      });
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
