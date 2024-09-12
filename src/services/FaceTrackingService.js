import { ref } from "vue";
const BASE_URL = "http://127.0.0.1:5000";
const IDENTIFY_ENDPOINT = BASE_URL + "/recognize_faces";
const TRAIN_MODEL_ENDPOINT = BASE_URL + "/train_model";
const LOG_ENDPOINT = BASE_URL + "/get_auditoria_data";
class FaceTrackingService {
    
    constructor(){
        this.results = ref([]);
        this.response = ref();
        this.log = ref([]);
    }

    getResults(){
        return this.results;
    }
    getResponse(){
        return this.response;
    }
    getLog(){
        return this.log;
    }

    // {"image": "data klajsldjka"}
    async identify(params){
        try {
            const endpoint = IDENTIFY_ENDPOINT;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            const json = await response.json();
            this.results.value = json;
        } catch (error) {
            console.log(error);
        }
    }
    // Params: { "folder_name": "", "images": ["base64strings"] }
    async addNewFace(params){
        try {
            const endpoint = TRAIN_MODEL_ENDPOINT;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            const json = await response.json();
            this.response.value = json;
        } catch (error) {
            console.log(error);
        }
    }

    async requestLogData(){
        try {
            const endpoint = LOG_ENDPOINT;
            const response = await fetch(endpoint);
            const json = await response.json();
            this.log.value = json;
        } catch (error) {
            console.log(error);
        }
    }
}

export default FaceTrackingService;