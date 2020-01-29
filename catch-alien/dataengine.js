class DataEngine{

    constructor( data_id ){

        // retrieve data from localstorage
        this.data_id = data_id ;
        this.db = localStorage.getItem(this.data_id) ;
        if( this.db == null ){
            this.db = {} ;
        }
    }


    create_user_password( uid , pwd ){
        if( this.db[uid] != null ){
            console.log('id exist!! :'+uid);
            return false ;
        }else{
            this.db[uid] = {} ;
            this.db[uid]['pwd'] = atob(pwd) ;
            return true ;
        }
    }

    check_user_is_valid( usr_id , pwd ){
        if( this.db[usr_id] != null ){
            if( this.db[usr_id].pwd === atob(pwd)){
                return true ;
            }
        }
        return false ;
    }

    reset_usr_password( usr_id , pwd , old_pwd){
        if( this.db[usr_id] != null ){
            console.log('id exist!! '+usr_id);
            
        }else{
            this.db[usr_id] = {} ;
            this.db[usr_id]['pwd'] = pwd ;
        }
    }

    save(){

    }

    export_data(){

    }

    import_data(){

    }

}