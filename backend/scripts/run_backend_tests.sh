#!/bin/bash
# Run tests with coverage
docker exec zssn_backend python -m coverage run --rcfile=.coveragerc manage.py test

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi

# Generate coverage report
docker exec zssn_backend python -m coverage report --rcfile=.coveragerc

# Check coverage threshold
docker exec zssn_backend python -m coverage report --rcfile=.coveragerc --fail-under=80

if [ $? -ne 0 ]; then
 echo "Coverage below threshold. Push aborted."
 exit 1
fi

echo "All checks passed. Push allowed."