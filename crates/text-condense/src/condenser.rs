use wasm_bindgen::prelude::*;

use crate::CondenseOptions;

#[wasm_bindgen]
pub struct Condenser {
    options: CondenseOptions,
}

#[wasm_bindgen]
impl Condenser {
    #[wasm_bindgen(constructor)]
    pub fn new(options: CondenseOptions) -> Self {
        Self { options }
    }

    #[wasm_bindgen]
    pub fn condense(&self) {
        log::info!("Hello world! options = {:?}", self.options);
    }
}
