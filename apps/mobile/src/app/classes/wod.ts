import {
  ExerciseAttributeEnum,
  FormatEnum,
  FormatFlowEnum,
  GaugeEnum,
  ModalityEnum,
} from '../enums/enums';

export const Schedule = [
  'M',
  'G,W',
  'M,G,W',
  'M,G',
  'W',
  'G',
  'W,M',
  'G,W,M',
  'G,W',
  'M',
  'W',
  'M,G',
  'W,M,G',
  'W,M',
  'G',
];

export class WodDay {
  id: number | undefined;
  date: Date | undefined;
  schedule: string | undefined;
}

export class Wod {
  id: number | undefined;
  format: FormatEnum | undefined;
  timecap: number | undefined;
  rounds: number | undefined;
  flow: FormatFlowEnum | undefined;
  exercises: Array<Exercise> | undefined;
}

export class Exercise {
  id: number | undefined;
  name: string | undefined;
  gauge: number | undefined;
  gaugeType: GaugeEnum | undefined;
  attribute: ExerciseAttributeEnum | undefined;
  modality: ModalityEnum | undefined;
}
