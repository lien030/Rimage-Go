export namespace main {
	
	export class DirectoryPickerResponse {
	    result: boolean;
	    dir: string;
	
	    static createFrom(source: any = {}) {
	        return new DirectoryPickerResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.result = source["result"];
	        this.dir = source["dir"];
	    }
	}
	export class FilesPickerResponse {
	    result: boolean;
	    files: string[];
	
	    static createFrom(source: any = {}) {
	        return new FilesPickerResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.result = source["result"];
	        this.files = source["files"];
	    }
	}

}

