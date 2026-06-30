import pandas as pd


class UploadService:

    @staticmethod
    def save_uploaded_file(file_path: str):
        """
        Read Excel file without assuming header.
        """
        return pd.read_excel(
            file_path,
            header=None
        )

    @staticmethod
    def detect_header(raw_df, required_columns):

        for index, row in raw_df.iterrows():

            row_values = [
                str(value).strip().lower()
                for value in row
                if pd.notna(value)
            ]

            matched = True

            for aliases in required_columns:

                if not any(alias in row_values for alias in aliases):
                    matched = False
                    break

            if matched:
                return index

        return None

    @staticmethod
    def read_excel(file_path, header_row):

        return pd.read_excel(
            file_path,
            header=header_row
        )
    
    @staticmethod
    def detect_columns(df, column_mapping):

        detected_mapping = {}

        for db_field, possible_names in column_mapping.items():

            for column in df.columns:

                column_lower = str(column).strip().lower()

                if column_lower in possible_names:

                    detected_mapping[db_field] = column
                    break

        return detected_mapping
    
    @staticmethod
    def extract_records(df, detected_mapping):

        records = []

        for _, row in df.iterrows():

            record = {}

            for db_field, excel_column in detected_mapping.items():

                value = row.get(excel_column)

                if pd.isna(value):
                    value = None

                record[db_field] = value

            records.append(record)

        return records