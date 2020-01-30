class DataEngine {

    constructor(data_id) {

        // retrieve data from localstorage
        this.data_id = data_id;
        this.db = localStorage.getItem(this.data_id);
        if (this.db == null) {
            this.db = {};
        }

        // db field_name
        this.FN_TOTAL_LV = 'total-level' ;
        this.FN_P_COUNT = 'play-count' ;
        this.FN_RECORD = 'record' ;
        this.FN_DATETIME='datetime' ;
        this.FN_SCORE = 'score' ;
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
            this.db[uid]['pwd'] = atob(pwd);
            console.log('create user : successed!! : '+uid);
            return true;
        }
    }

    check_user_is_valid(uid, pwd) {
        if (this.db[uid] != null) {
            if (this.db[uid].pwd === atob(pwd)) {
                return true;
            }
        }
        return false;
    }

    reset_usr_password(uid,  old_pwd , new_pwd) {

        if (this.check_user_is_valid(uid, old_pwd)) {           
            this.db[uid]['pwd'] = atob(new_pwd);
            console.log('reset password : successed!!');            
            return true ;
        }
        return false;
    }


    ///////////////////////////
    // game record
    ///////////////////////////    
    create_game( uid , game_name , max_level ){
        if (this.db[uid] != null) {
            if( this.db[uid][game_name]!=null){
                return false ;
            }
            this.db[uid][game_name] = {} ;
            this.db[uid][game_name][this.FN_TOTAL_LV] = max_level ;
            this.db[uid][game_name][this.FN_P_COUNT] = [] ;
            this.db[uid][game_name][this.FN_RECORD]= [] ;
            this.db[uid][game_name][this.FN_RECORD][0]={};
            this.db[uid][game_name][this.FN_RECORD][0][this.FN_DATETIME] = new Date().format("yyyy-MM-dd hh:mm:ss");
            this.db[uid][game_name][this.FN_RECORD][0][this.FN_SCORE]=[];
            for (let i = 0; i < max_level ; i++) {
                this.db[uid][game_name][this.FN_P_COUNT][i] = 0 ; 
                this.db[uid][game_name][this.FN_RECORD][0][this.FN_SCORE][i]=0;           
            }
            return true ;
        }else{
            console.log("the user doesn't exist!! : "+uid);            
            return false ;
        }        
    }
    add_game_record( user , game_name , level_index , score ){
        if (this.db[uid] != null) {
            if( this.db[uid][game_name]==undefined){
                console.log("the game doesn't exist !! :"+game_name);                
                console.log('please [create_game] first!!');                
                return false ;
            }
            this.db[uid][game_name][this.FN_P_COUNT][level_index]++;
            let record_data = this.db[uid][game_name][this.FN_RECORD] ;
            if( record_data.length==0){
?
            }else{
?
            }
            
            //this.db[uid][game_name][]

        }else{
            console.log("the user doesn't exist!! : "+uid);            
            return false ;
        }   
        
    }

    ///////////////////////////
    // IO related
    ///////////////////////////


    save() {

    }

    export_data() {

    }

    import_data() {

    }

}