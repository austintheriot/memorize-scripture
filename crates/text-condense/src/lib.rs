use wasm_bindgen::prelude::*;

/// Initialize logging at module instantiation
#[wasm_bindgen(start)]
fn start() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
}

#[wasm_bindgen]
pub struct Condenser;

#[wasm_bindgen]
impl Condenser {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self
    }

    #[wasm_bindgen]
    pub fn run(&self) {
        log::info!("Hello world!");
    }
}
