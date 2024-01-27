<script setup lang="ts">
type Event = {
  id: number;
  course_id: string;
  class_id: string;
  prof: string;
  day: Days;
  start_at: string;
  end_at: string;
};
const { events, courses } = defineProps<{
  events: (Event & {
    conflicts: Event[];
  })[];
  courses: {
    id: number;
    course_id: string | null;
    name: string | null;
  }[];
}>();
const { pickedClasses } = defineModels<{
  pickedClasses: ModelOptions<
    string[],
    {
      defaultValue: [];
    }
  >;
}>();
function toggleClasss(class_id: string) {
  if (pickedClasses.value.includes(class_id)) {
    pickedClasses.value = pickedClasses.value.filter((c) => c !== class_id);
  } else {
    const courseId = events.find((c) => c.class_id === class_id)?.course_id;
    const otherCourses =
      events.filter((c) => c.course_id === courseId)?.map((c) => c.class_id) ??
      [];
    pickedClasses.value = pickedClasses.value.filter(
      (c) => !otherCourses.includes(c)
    );
    pickedClasses.value.push(class_id);
  }
}

const dayMapper: Record<Days, string> = {
  sat: "sm:col-start-1",
  sun: "sm:col-start-2",
  mon: "sm:col-start-3",
  tues: "sm:col-start-4",
  wed: "sm:col-start-5",
  thurs: "sm:col-start-6",
  fri: "sm:col-start-7",
};

const hoverEntry = ref("");
function getEventColPos(start: string) {
  const [hour, min] = start.split(":").map(Number);

  return (hour - 7) * 19 + (min / 30) * 10 + 2;
}
function getEventHeight(start: string, end: string) {
  const s = getEventColPos(start);
  const e = getEventColPos(end);

  return e - s;
}

function countConflictingEntries(entry: (typeof events)[number]) {
  const currentIndex = events.findIndex((e) => e.class_id === entry.class_id);
  return events.filter((otherEntry, index) => {
    if (
      entry.class_id !== otherEntry.class_id &&
      currentIndex > index &&
      entry.day === otherEntry.day &&
      doEntriesOverlap(entry, otherEntry)
    ) {
      return true;
    }
  }).length;
}

function doEntriesOverlap(
  entry1: (typeof events)[number],
  entry2: (typeof events)[number]
) {
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const start1 = parseTime(entry1.start_at);
  const end1 = parseTime(entry1.end_at);
  const start2 = parseTime(entry2.start_at);
  const end2 = parseTime(entry2.end_at);

  // Check for overlap
  return start1 < end2 && end1 > start2;
}

function getCourseNameById(id: string) {
  return courses?.find((c) => c.course_id === id)?.name ?? "-"
}
</script>
<template>
  <div class="flex h-full flex-col ltr">
    <div class="flex flex-auto flex-col overflow-auto bg-gray-800">
      <div
        style="width: 165%"
        class="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
      >
        <div
          class="sticky top-0 z-30 flex-none bg-gray-800 shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
        >
          <div
            class="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden"
          >
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              M
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                >10</span
              >
            </button>
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              T
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                >11</span
              >
            </button>
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              W
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                >12</span
              >
            </button>
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              T
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                >13</span
              >
            </button>
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              F
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                >14</span
              >
            </button>
            <button type="button" class="flex flex-col items-center pt-2 pb-3">
              S
              <span
                class="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900"
                >15</span
              >
            </button>
          </div>

          <div
            class="-mr-px hidden grid-cols-6 divide-x divide-gray-900 border-r border-gray-900 text-sm leading-6 text-gray-500 sm:grid"
          >
            <div class="col-end-1 w-14" />

            <div class="flex items-center justify-center py-3">
              <span>شنبه</span>
            </div>
            <div class="flex items-center justify-center py-3">
              <span>یکشنبه</span>
            </div>
            <div class="flex items-center justify-center py-3">
              <span>دوشنبه</span>
            </div>
            <div class="flex items-center justify-center py-3">
              <span>سه‌شنبه</span>
            </div>
            <div class="flex items-center justify-center py-3">
              <span>چهارشنبه</span>
            </div>
            <div class="flex items-center justify-center py-3">
              <span>پنج‌شنبه</span>
            </div>
          </div>
        </div>
        <div class="flex flex-auto">
          <div
            class="sticky left-0 z-10 w-14 flex-none bg-gray-800 ring-1 ring-gray-900"
          />
          <div class="grid flex-auto grid-cols-1 grid-rows-1">
            <!-- Horizontal lines -->
            <div
              class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-900"
              style="grid-template-rows: repeat(30, minmax(3.5rem, 1fr))"
            >
              <div class="row-end-1 h-7" />

              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  7:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  8:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  9:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  10:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  11:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  12:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  13:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  14:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  15:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  16:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  17:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  18:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  19:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  20:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  21:00
                </div>
              </div>
              <div />
              <div>
                <div
                  class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
                >
                  22:00
                </div>
              </div>
            </div>

            <!-- Vertical lines -->
            <div
              class="col-start-1 col-end-2 row-start-1 hidden grid-cols-6 grid-rows-1 divide-x divide-gray-900 sm:grid sm:grid-cols-6"
            >
              <div class="col-start-1 row-span-full" />
              <div class="col-start-2 row-span-full" />
              <div class="col-start-3 row-span-full" />
              <div class="col-start-4 row-span-full" />
              <div class="col-start-5 row-span-full" />
              <div class="col-start-6 row-span-full" />
              <div class="col-start-7 row-span-full w-8" />
            </div>

            <!-- Events -->
            <ol
              class="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-6 sm:pr-8"
              style="
                grid-template-rows: 1.75rem repeat(288, minmax(0, 1fr)) auto;
              "
            >
              <li
                v-for="event in events"
                class="relative mt-px flex text-right transition-all"
                :class="
                  (hoverEntry && hoverEntry !== event.class_id
                    ? 'opacity-10'
                    : hoverEntry && hoverEntry === event.class_id
                    ? '!w-full'
                    : '') + ` ${dayMapper[event.day]}`
                "
                dir="rtl"
                :style="`grid-row: ${getEventColPos(event.start_at).toFixed(
                  0
                )} / span ${
                  hoverEntry === event.class_id &&
                  +getEventHeight(event.start_at, event.end_at).toFixed(0) < 20
                    ? '20'
                    : getEventHeight(event.start_at, event.end_at).toFixed(0)
                }; width: calc(100% - ${countConflictingEntries(event) * 20}%)`"
                @mouseover="hoverEntry = event.class_id"
                @mouseleave="hoverEntry = ''"
              >
                <UTooltip
                  class="w-full"
                  :text="
                    event.conflicts.length > 0
                      ? `این درس با ${getCourseNameById(event.conflicts[0].course_id)} که انتخاب کردی تداخل داره`
                      : ''
                  "
                  :ui="{
                    container: event.conflicts.length > 0 ? '' : 'opacity-0',
                  }"
                >
                  <a
                    class="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5 border-4"
                    :class="[
                      pickedClasses.includes(event.class_id)
                        ? 'bg-primary'
                        : 'bg-gray-700',
                      event.conflicts.length > 0
                        ? 'border-yellow-600 cursor-not-allowed'
                        : 'border-gray-800 cursor-pointer',
                    ]"
                    @click="event.conflicts.length > 0 ? null : toggleClasss(event.class_id)"
                  >
                    <p
                      class="order-1 text-base font-bold truncate"
                      :class="
                        pickedClasses.includes(event.class_id)
                          ? 'text-gray-700'
                          : 'text-zinc-100'
                      "
                    >
                      {{
                       getCourseNameById(event.course_id)
                      }}
                    </p>
                    <p
                      class="order-1 text-sm font-bold truncate"
                      :class="
                        pickedClasses.includes(event.class_id)
                          ? 'text-gray-800'
                          : 'text-white'
                      "
                    >
                      {{ event.prof }}
                    </p>
                    <p
                      class="font-normal"
                      :class="
                        pickedClasses.includes(event.class_id)
                          ? 'text-gray-800'
                          : 'text-white'
                      "
                    >
                      <span>{{ event.start_at }}</span>
                      /
                      <span>{{ event.end_at }}</span>
                    </p>
                  </a>
                </UTooltip>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
