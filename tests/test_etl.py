import pytest
from unittest.mock import MagicMock
from etl.ingest_csv import run_etl
from tests.generate import generate_csv

def test_etl_instantiation_success():
    mock_save = MagicMock()
    generate_csv("tests/data_test/etl_instantiation_test.csv", num_rows=1)
    run_etl("tests/data_test/etl_instantiation_test.csv", save_fn=mock_save)
    assert mock_save.call_count > 0
    args, kwargs = mock_save.call_args
    expected_keys = ["tconst", "title", "plot", "release_date", "plot_vector"]
    for key in expected_keys:
        assert key in kwargs

def test_etl_empty_csv():
    mock_save = MagicMock()
    generate_csv("tests/data_test/empty.csv", num_rows=0)
    run_etl("tests/data_test/empty.csv", save_fn=mock_save)
    assert mock_save.call_count == 0

# @pytest.mark.performance
# def test_stress_etl_large_csv():
#     mock_save = MagicMock()
#     generate_csv("tests/data_test/large.csv", num_rows=100)
#     run_etl("tests/data_test/large.csv", save_fn=mock_save)
#     assert mock_save.call_count == 100