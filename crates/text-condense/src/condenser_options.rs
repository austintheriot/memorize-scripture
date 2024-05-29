use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct CondenseOptions {
    pub spaces_between_letters: i32,
}

#[wasm_bindgen]
impl CondenseOptions {
    #[wasm_bindgen]
    pub fn builder() -> CondenseOptionsBuilder {
        CondenseOptionsBuilder::default()
    }
}

#[wasm_bindgen]
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct CondenseOptionsBuilder {
    spaces_between_letters: Option<i32>,
}

#[wasm_bindgen]
impl CondenseOptionsBuilder {
    #[wasm_bindgen]
    pub fn build(self) -> CondenseOptions {
        CondenseOptions {
            spaces_between_letters: self.spaces_between_letters.unwrap_or(0),
        }
    }

    #[wasm_bindgen]
    pub fn spaces_between_letters(mut self, num_spaces: i32) -> Self {
        self.spaces_between_letters = Some(num_spaces);
        self
    }
}
