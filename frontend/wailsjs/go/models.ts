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
	export class Task {
	    id: string;
	    status: string;
	    filePath: string;
	    fileName: string;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.status = source["status"];
	        this.filePath = source["filePath"];
	        this.fileName = source["fileName"];
	    }
	}
	export class ProcessWorker {
	    id: string;
	    status: string;
	    task: Task;
	
	    static createFrom(source: any = {}) {
	        return new ProcessWorker(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.status = source["status"];
	        this.task = this.convertValues(source["task"], Task);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RimageParams {
	    quality: number;
	    quantization: number;
	    dithering: number;
	    resize: boolean;
	    resizeWidth: number;
	    resizeHeight: number;
	    filter: string;
	    threads: number;
	    suffix: string;
	    backup: boolean;
	    recursive: boolean;
	    format: string;
	    outputDir: string;
	
	    static createFrom(source: any = {}) {
	        return new RimageParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.quality = source["quality"];
	        this.quantization = source["quantization"];
	        this.dithering = source["dithering"];
	        this.resize = source["resize"];
	        this.resizeWidth = source["resizeWidth"];
	        this.resizeHeight = source["resizeHeight"];
	        this.filter = source["filter"];
	        this.threads = source["threads"];
	        this.suffix = source["suffix"];
	        this.backup = source["backup"];
	        this.recursive = source["recursive"];
	        this.format = source["format"];
	        this.outputDir = source["outputDir"];
	    }
	}

}

