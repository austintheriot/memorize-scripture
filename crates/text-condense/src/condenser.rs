use wasm_bindgen::prelude::*;

use crate::CondenserOptions;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Condenser {}

#[wasm_bindgen]
impl Condenser {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    #[wasm_bindgen(js_name = condenseWithOptions)]
    pub fn condense_with_options(&self, input: String, options: CondenserOptions) -> String {
        log::info!("Hello world! options = {:?}, string = {}", options, &input);

        let output = input;
        output
    }
}
