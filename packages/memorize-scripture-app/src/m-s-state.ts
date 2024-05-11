import { computed, signal } from '@lit-labs/preact-signals';


export const a = signal(0);
export const b = signal(0);
export const bothAreEven = computed(() => {
  if (a.value % 2 == 0 && b.value % 2 == 0) {
    return true
  }

  return false
});

setInterval(() => {
  a.value += 1;
}, 1000)


setInterval(() => {
  b.value += 1;
}, 1500)

