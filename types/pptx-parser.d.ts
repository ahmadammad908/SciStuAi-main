// types/pptx-parser.d.ts
declare module 'pptx-parser' {
    interface Slide {
      text: string;
      // Add other slide properties if needed
    }
  
    function parse(arrayBuffer: ArrayBuffer): Promise<{
      slides: Slide[];
      // Add other presentation properties if needed
    }>;
  
    export = {
      parse
    };
  }