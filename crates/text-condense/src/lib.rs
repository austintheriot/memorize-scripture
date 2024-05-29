use wasm_bindgen::prelude::*;

/// Initialize logging at module instantiation
#[wasm_bindgen(start)]
fn start() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
}

mod condenser;
mod condenser_options;

pub use condenser::*;
pub use condenser_options::*;
